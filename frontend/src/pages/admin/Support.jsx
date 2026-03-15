import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import supportService from "../../services/supportService";
import { formatDate } from "../../utils/formatCurrency";
import useSocket from "../../hooks/useSocket";
const messageSchema = Yup.object({
  message: Yup.string()
    .min(1, "Message cannot be empty")
    .required("Message is required"),
});

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
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
      const data = await supportService.getAllTickets();
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

  const handleMarkInProgress = async (ticketId) => {
    try {
      await supportService.markInProgress(ticketId);
      toast.success("Ticket marked as in progress!");
      fetchTickets();
      setSelectedTicket((prev) =>
        prev?.ticketId === ticketId
          ? { ...prev, status: "IN_PROGRESS" }
          : prev
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update ticket"
      );
    }
  };

  const handleResolve = async (ticketId) => {
    try {
      await supportService.resolveTicket(ticketId);
      toast.success("Ticket resolved!");
      fetchTickets();
      setSelectedTicket((prev) =>
        prev?.ticketId === ticketId
          ? { ...prev, status: "RESOLVED" }
          : prev
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to resolve ticket"
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

  const filteredTickets = tickets.filter(
    (t) =>
      statusFilter === "ALL" || t.status === statusFilter
  );

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
              💬 Support Management
            </h4>
            <p
              style={{ color: "var(--text-light)", margin: 0 }}
            >
              Manage customer support tickets
            </p>
          </div>
          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="myfin-input"
            style={{ width: "auto" }}
          >
            <option value="ALL">All Tickets</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </motion.div>

        <div className="row">
          {/* Tickets List */}
          <div className="col-lg-4 mb-4">
            <div className="myfin-card" style={{ padding: 0 }}>
              <div
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid var(--border)",
                  fontWeight: "700",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  All Tickets ({filteredTickets.length})
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--accent)",
                    fontWeight: "600",
                  }}
                >
                  {
                    tickets.filter(
                      (t) => t.status === "OPEN"
                    ).length
                  }{" "}
                  Open
                </span>
              </div>

              {filteredTickets.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--text-light)",
                  }}
                >
                  No tickets found
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.ticketId}
                    onClick={() => setSelectedTicket(ticket)}
                    style={{
                      padding: "1rem",
                      borderBottom:
                        "1px solid var(--border)",
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
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "0.875rem",
                        }}
                      >
                        {ticket.ticketId}
                      </div>
                      <span
                        style={{
                          background: `${getStatusColor(ticket.status)}20`,
                          color: getStatusColor(
                            ticket.status
                          ),
                          border: `1px solid ${getStatusColor(ticket.status)}40`,
                          borderRadius: "20px",
                          padding: "0.15rem 0.6rem",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                        }}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-light)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {ticket.subject}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-light)",
                        marginTop: "0.25rem",
                      }}
                    >
                      {ticket.customerId}
                    </div>
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
                <div style={{ fontSize: "3rem" }}>💬</div>
                <h5 style={{ marginTop: "1rem" }}>
                  Select a ticket to view
                </h5>
              </div>
            ) : (
              <div
                className="myfin-card"
                style={{ padding: 0 }}
              >
                {/* Chat Header */}
                <div
                  style={{
                    padding: "1rem",
                    borderBottom:
                      "1px solid var(--border)",
                    background:
                      "linear-gradient(135deg, var(--primary), var(--secondary))",
                    borderRadius: "16px 16px 0 0",
                    color: "white",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
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
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      {selectedTicket.status === "OPEN" && (
                        <button
                          onClick={() =>
                            handleMarkInProgress(
                              selectedTicket.ticketId
                            )
                          }
                          style={{
                            background:
                              "rgba(245,158,11,0.3)",
                            border:
                              "1px solid rgba(245,158,11,0.5)",
                            color: "white",
                            borderRadius: "8px",
                            padding: "0.4rem 0.75rem",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                          }}
                        >
                          In Progress
                        </button>
                      )}
                      {selectedTicket.status !==
                        "RESOLVED" && (
                          <button
                            onClick={() =>
                              handleResolve(
                                selectedTicket.ticketId
                              )
                            }
                            style={{
                              background:
                                "rgba(16,185,129,0.3)",
                              border:
                                "1px solid rgba(16,185,129,0.5)",
                              color: "white",
                              borderRadius: "8px",
                              padding: "0.4rem 0.75rem",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                            }}
                          >
                            ✓ Resolve
                          </button>
                        )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  style={{
                    height: "350px",
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
                      No messages yet
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.messageId}
                        style={{
                          display: "flex",
                          justifyContent:
                            msg.senderType === "ADMIN"
                              ? "flex-end"
                              : "flex-start",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "70%",
                            background:
                              msg.senderType === "ADMIN"
                                ? "var(--secondary)"
                                : "var(--card)",
                            color:
                              msg.senderType === "ADMIN"
                                ? "white"
                                : "var(--text)",
                            borderRadius:
                              msg.senderType === "ADMIN"
                                ? "16px 16px 4px 16px"
                                : "16px 16px 16px 4px",
                            padding: "0.75rem 1rem",
                            boxShadow: "var(--shadow)",
                            border:
                              msg.senderType === "CUSTOMER"
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
                              ? "🛡️ You (Admin)"
                              : "👤 Customer"}
                          </div>
                          <div
                            style={{ fontSize: "0.9rem" }}
                          >
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
                      borderTop:
                        "1px solid var(--border)",
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
                              placeholder="Type your reply..."
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
                              Reply 📨
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
                      borderTop:
                        "1px solid var(--border)",
                      fontSize: "0.875rem",
                    }}
                  >
                    ✅ Ticket resolved
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

export default AdminSupport;