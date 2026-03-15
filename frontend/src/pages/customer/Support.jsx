import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import supportService from "../../services/supportService";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatCurrency";
import useSocket from "../../hooks/useSocket";
import { FiMessageSquare, FiTag, FiShield, FiUser, FiCheckCircle } from "react-icons/fi";

const ticketSchema = Yup.object({
  subject: Yup.string()
    .min(10, "Subject must be at least 10 characters")
    .required("Subject is required"),
});

const messageSchema = Yup.object({
  message: Yup.string()
    .min(1, "Message cannot be empty")
    .required("Message is required"),
});

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useSocket();
  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.ticketId);
    }
  }, [selectedTicket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  useEffect(() => {
  if (!selectedTicket || !socketRef.current) return;
  const socket = socketRef.current;
  socket.emit("join_ticket", selectedTicket.ticketId);
  socket.on("new_message", (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  });
  return () => {
    socket.emit("leave_ticket", selectedTicket.ticketId);
    socket.off("new_message");
  };
}, [selectedTicket, socketRef.current]);
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await supportService.getMyTickets();
      setTickets(data.tickets);
    } catch (error) {
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (ticketId) => {
    try {
      const data = await supportService.getMessages(ticketId);
      setMessages(data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const handleCreateTicket = async (values, { resetForm }) => {
    try {
      await supportService.createTicket(values);
      toast.success(
        "Support ticket created! We will get back to you shortly."
      );
      setShowNewTicket(false);
      resetForm();
      fetchTickets();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create ticket"
      );
    }
  };

  const handleSendMessage = async (values, { resetForm }) => {
    try {
      await supportService.sendMessage(
        selectedTicket.ticketId,
        values
      );
      resetForm();
      fetchMessages(selectedTicket.ticketId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send message"
      );
    }
  };

  const getStatusColor = (status) => {
    const map = {
      OPEN: "var(--success)",
      IN_PROGRESS: "var(--accent)",
      RESOLVED: "var(--text-light)",
    };
    return map[status] || "var(--text-light)";
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="myfin-content" style={{ flex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="d-flex justify-content-between align-items-center mb-4"
        >
          <div>
            <h4
              style={{
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "0.25rem",
              }}
            >
              <FiMessageSquare/> Support
            </h4>
            <p
              style={{ color: "var(--text-light)", margin: 0 }}
            >
              Get help from our support team
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewTicket(!showNewTicket)}
            className="btn-myfin-primary"
          >
            {showNewTicket ? "✕ Cancel" : "+ New Ticket"}
          </motion.button>
        </motion.div>

        {/* New Ticket Form */}
        {showNewTicket && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="myfin-card mb-4"
          >
            <h5
              style={{
                fontWeight: "700",
                marginBottom: "1rem",
              }}
            >
              <FiTag/> Raise New Ticket
            </h5>
            <Formik
              initialValues={{ subject: "" }}
              validationSchema={ticketSchema}
              onSubmit={handleCreateTicket}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label
                      style={{
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                        display: "block",
                      }}
                    >
                      Subject
                    </label>
                    <Field
                      name="subject"
                      type="text"
                      placeholder="Describe your issue briefly"
                      className="myfin-input w-100"
                    />
                    <ErrorMessage
                      name="subject"
                      component="div"
                      style={{
                        color: "var(--danger)",
                        fontSize: "0.8rem",
                        marginTop: "0.25rem",
                      }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-myfin-primary"
                    style={{ padding: "0.75rem 2rem" }}
                  >
                    {isSubmitting
                      ? "Creating..."
                      : "Create Ticket"}
                  </motion.button>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}

        <div className="row">
          {/* Tickets List */}
          <div className="col-lg-4 mb-4">
            <div className="myfin-card" style={{ padding: 0 }}>
              <div
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid var(--border)",
                  fontWeight: "700",
                }}
              >
                My Tickets ({tickets.length})
              </div>
              {tickets.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--text-light)",
                  }}
                >
                  No tickets yet
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.ticketId}
                    onClick={() => setSelectedTicket(ticket)}
                    style={{
                      padding: "1rem",
                      borderBottom: "1px solid var(--border)",
                      cursor: "pointer",
                      background:
                        selectedTicket?.ticketId ===
                        ticket.ticketId
                          ? "rgba(30,64,175,0.05)"
                          : "transparent",
                      borderLeft:
                        selectedTicket?.ticketId ===
                        ticket.ticketId
                          ? "3px solid var(--secondary)"
                          : "3px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "0.875rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {ticket.ticketId}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-light)",
                        marginBottom: "0.5rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {ticket.subject}
                    </div>
                    <span
                      style={{
                        background: `${getStatusColor(ticket.status)}20`,
                        color: getStatusColor(ticket.status),
                        border: `1px solid ${getStatusColor(ticket.status)}40`,
                        borderRadius: "20px",
                        padding: "0.15rem 0.6rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}
                    >
                      {ticket.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="col-lg-8 mb-4">
            {!selectedTicket ? (
              <div
                className="myfin-card text-center"
                style={{ padding: "3rem" }}
              >
                <div style={{ fontSize: "3rem", display: "flex", justifyContent: "center" }}><FiMessageSquare /></div>
                <h5 style={{ marginTop: "1rem" }}>
                  Select a ticket to view messages
                </h5>
                <p style={{ color: "var(--text-light)" }}>
                  Or create a new support ticket
                </p>
              </div>
            ) : (
              <div className="myfin-card" style={{ padding: 0 }}>
                {/* Chat Header */}
                <div
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid var(--border)",
                    background:
                      "linear-gradient(135deg, var(--primary), var(--secondary))",
                    borderRadius: "16px 16px 0 0",
                    color: "white",
                  }}
                >
                  <div style={{ fontWeight: "700" }}>
                    {selectedTicket.ticketId}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      opacity: 0.8,
                    }}
                  >
                    {selectedTicket.subject}
                  </div>
                </div>

                {/* Messages */}
                <div
                  style={{
                    height: "400px",
                    overflowY: "auto",
                    padding: "1rem",
                    background: "var(--background)",
                  }}
                >
                  {messages.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "var(--text-light)",
                        paddingTop: "2rem",
                      }}
                    >
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.messageId}
                        style={{
                          display: "flex",
                          justifyContent:
                            msg.senderType === "CUSTOMER"
                              ? "flex-end"
                              : "flex-start",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "70%",
                            background:
                              msg.senderType === "CUSTOMER"
                                ? "var(--secondary)"
                                : "var(--card)",
                            color:
                              msg.senderType === "CUSTOMER"
                                ? "white"
                                : "var(--text)",
                            borderRadius:
                              msg.senderType === "CUSTOMER"
                                ? "16px 16px 4px 16px"
                                : "16px 16px 16px 4px",
                            padding: "0.75rem 1rem",
                            boxShadow: "var(--shadow)",
                            border:
                              msg.senderType === "ADMIN"
                                ? "1px solid var(--border)"
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.75rem",
                              opacity: 0.7,
                              marginBottom: "0.25rem",
                              fontWeight: "600",
                            }}
                          >
                            {msg.senderType === "ADMIN"
                              ?  "Support Team"
                              : "You"}
                          </div>
                          <div style={{ fontSize: "0.9rem" }}>
                            {msg.message}
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              opacity: 0.6,
                              marginTop: "0.25rem",
                              textAlign: "right",
                            }}
                          >
                            {formatDate(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {selectedTicket.status !== "RESOLVED" ? (
                  <div
                    style={{
                      padding: "1rem",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <Formik
                      initialValues={{ message: "" }}
                      validationSchema={messageSchema}
                      onSubmit={handleSendMessage}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                            }}
                          >
                            <Field
                              name="message"
                              type="text"
                              placeholder="Type your message..."
                              className="myfin-input"
                              style={{ flex: 1 }}
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              disabled={isSubmitting}
                              className="btn-myfin-primary"
                              style={{
                                padding: "0.75rem 1.5rem",
                              }}
                            >
                              Send 📨
                            </motion.button>
                          </div>
                          <ErrorMessage
                            name="message"
                            component="div"
                            style={{
                              color: "var(--danger)",
                              fontSize: "0.8rem",
                              marginTop: "0.25rem",
                            }}
                          />
                        </Form>
                      )}
                    </Formik>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      color: "var(--text-light)",
                      borderTop: "1px solid var(--border)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <FiCheckCircle/> This ticket has been resolved. Raise a
                    new ticket if you need further assistance.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;