import React, { useState, useEffect } from "react";
import ReusableTable from "../Common/Reusabletable";
import Footer from "../Common/Footer";
import instance from "../AxiosInstance/AxiosInstance";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NonTeachingFaculty() {
  const [nonTeachingStaff, setNonTeachingStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocName, setSelectedDocName] = useState("");

  // Fetch staff from API
  const fetchNonTeachingStaff = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/staff");
      console.log("All Staff Data:", response.data);
      
      // Filter for Non-Teaching staff only (staffType === "NON_TEACHING")
      const nonTeachingData = response.data.filter(
        item => item.staffType && 
        (item.staffType.toUpperCase() === "NON_TEACHING" || 
         item.staffType.toUpperCase() === "NON_TEACHING_STAFF" ||
         item.staffType.toLowerCase() === "non teaching staff" ||
         item.staffType.toLowerCase() === "non-teaching staff")
      );
      
      console.log("Non-Teaching Staff:", nonTeachingData);
      setNonTeachingStaff(nonTeachingData);
      setError(null);
      
      if (nonTeachingData.length === 0) {
        toast.info("No Non-Teaching staff found");
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch staff data";
      setError(errorMsg);
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNonTeachingStaff();
  }, []);

  // Calculate statistics
  const totalStaff = nonTeachingStaff.length;
  const activeStaff = nonTeachingStaff.filter(item => item.active !== false).length;
  const inactiveStaff = nonTeachingStaff.filter(item => item.active === false).length;

  // Handle image view
  const handleViewImage = (imageUrl, name) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setSelectedName(name);
      setOpenImageDialog(true);
    } else {
      toast.info("No image available for this staff member");
    }
  };

  // Close image dialog
  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedImage(null);
    setSelectedName("");
  };

  // Handle document view
  const handleViewDocument = (documentUrl, name) => {
    if (documentUrl) {
      // Check if it's a PDF or viewable in browser
      const ext = documentUrl.split('.').pop().toLowerCase();
      const viewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
      
      if (viewableTypes.includes(ext)) {
        window.open(documentUrl, '_blank');
      } else {
        // Use Google Docs Viewer for DOC, DOCX, etc.
        const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`;
        window.open(googleDocsUrl, '_blank');
        toast.info("Opening document in Google Docs Viewer");
      }
    } else {
      toast.info("No document available for this staff member");
    }
  };

  // Handle document download
  const handleDownloadDocument = (documentUrl, name) => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      const ext = documentUrl.split('.').pop().toLowerCase() || 'pdf';
      link.download = `${name}_document.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Downloading document...");
    } else {
      toast.info("No document available to download");
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <div
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            background: "#F6F1E4",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 16, color: "#5B5240" }}>Loading Non-Teaching staff...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <div
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            background: "#F6F1E4",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
            padding: 24,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚠️</div>
          <div style={{ fontSize: 18, color: "#B3542E", marginBottom: 8 }}>Failed to load data</div>
          <div style={{ fontSize: 14, color: "#5B5240" }}>{error}</div>
          <button
            onClick={fetchNonTeachingStaff}
            style={{
              marginTop: 16,
              padding: "10px 24px",
              borderRadius: 8,
              border: "1px solid #1E2A44",
              background: "#1E2A44",
              color: "#F6F1E4",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#F6F1E4",
          minHeight: "100%",
          color: "#241F1A",
          padding: "24px",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
          * { box-sizing: border-box; }
          .action-icon {
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            padding: 4px 10px;
            border-radius: 4px;
            border: none;
            margin: 0 2px;
          }
          .view-image {
            background: #E8E8E8;
            color: #1E2A44;
          }
          .view-image:hover {
            background: #1E2A44;
            color: #fff;
          }
          .view-doc {
            background: #E3F2FD;
            color: #1565C0;
          }
          .view-doc:hover {
            background: #1565C0;
            color: #fff;
          }
          .download-doc {
            background: #E8F5E9;
            color: #2E7D32;
          }
          .download-doc:hover {
            background: #2E7D32;
            color: #fff;
          }
          .staff-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #1E2A44;
            margin-right: 8px;
            vertical-align: middle;
            background: #E8E8E8;
          }
          .staff-name {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
          }
          .image-modal-content {
            max-width: 90%;
            max-height: 90%;
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease;
          }
          .image-modal-close {
            position: absolute;
            top: -12px;
            right: -12px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid #1E2A44;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 700;
            color: #1E2A44;
            transition: all 0.2s ease;
          }
          .image-modal-close:hover {
            background: #1E2A44;
            color: #fff;
          }
          .image-modal img {
            max-width: 100%;
            max-height: 70vh;
            border-radius: 8px;
            display: block;
          }
          .image-modal-name {
            text-align: center;
            margin-top: 12px;
            font-size: 18px;
            font-weight: 600;
            color: #1E2A44;
            font-family: "'Fraunces', serif";
          }
          .actions-cell {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
            justify-content: center;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            background: "#FFFDF7",
            border: "1px solid #E9E1CC",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              padding: "16px 20px",
              background: "#EFE8D4",
              borderBottom: "1px solid #E2D9C2",
            }}
          >
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 18,
                fontWeight: 600,
                margin: 0,
                color: "#1E2A44",
              }}
            >
              Non-Teaching Staff
            </h2>
          </div>

          <div style={{ padding: "12px 20px 20px" }}>
            {nonTeachingStaff.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#A79A7C" }}>
                No Non-Teaching staff found
              </div>
            ) : (
              <ReusableTable
                headers={["Sl.", "Name", "Qualification", "Designation", "Status", "Actions"]}
                rows={nonTeachingStaff.map((s, i) => [
                  i + 1,
                  <div className="staff-name">
                    {s.imageUrl ? (
                      <img
                        src={s.imageUrl}
                        alt={s.name}
                        className="staff-avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#1E2A44",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 600,
                        marginRight: 8,
                        flexShrink: 0,
                      }}>
                        {s.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <span style={{ fontWeight: 500 }}>{s.name}</span>
                    {s.documentUrl && (
                      <span style={{ 
                        fontSize: 12, 
                        color: "#1565C0",
                        marginLeft: 4,
                        background: "#E3F2FD",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}>
                        📄
                      </span>
                    )}
                  </div>,
                  s.qualification || "—",
                  s.designation || "—",
                  s.active !== false ? (
                    <span style={{ 
                      color: "#3E7A4F", 
                      fontWeight: 600,
                      background: "#E8F5E9",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      display: "inline-block"
                    }}>
                      Active
                    </span>
                  ) : (
                    <span style={{ 
                      color: "#B3542E", 
                      fontWeight: 600,
                      background: "#FFEBEE",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      display: "inline-block"
                    }}>
                      Inactive
                    </span>
                  ),
                  <div className="actions-cell">
                    <button
                      className="action-icon view-image"
                      onClick={() => handleViewImage(s.imageUrl, s.name)}
                      title="View Image"
                    >
                      🖼️ Image
                    </button>
                    {s.documentUrl && (
                      <>
                        <button
                          className="action-icon view-doc"
                          onClick={() => handleViewDocument(s.documentUrl, s.name)}
                          title="View Document"
                        >
                          📄 View
                        </button>
                        <button
                          className="action-icon download-doc"
                          onClick={() => handleDownloadDocument(s.documentUrl, s.name)}
                          title="Download Document"
                        >
                          ⬇️ Download
                        </button>
                      </>
                    )}
                  </div>
                ])}
               
              />
            )}
          </div>
        </div>
      </div>

      {/* Image View Modal */}
      {openImageDialog && (
        <div className="image-modal" onClick={handleCloseImageDialog}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={handleCloseImageDialog}>
              ✕
            </button>
            {selectedImage ? (
              <>
                <img src={selectedImage} alt={selectedName} />
                <div className="image-modal-name">{selectedName}</div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "#6B7280" }}>
                No image available
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}