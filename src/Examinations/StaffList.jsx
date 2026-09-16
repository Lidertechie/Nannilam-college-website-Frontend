import React from "react";

const staff = [
    {
        name: "Mr. S.Raghavan",
        qualification: "M.Sc., M.Phil.",
        role: "COMPUTER PROGRAMMER",
        bg: "#2E86DE",
        initials: "SR",
    },
    {
        name: "Mr. S. Kannan",
        qualification: "M.B.A., M.Phil.,PGDCA.,",
        role: "COMPUTER PROGRAMMER",
        bg: "#F5D6A8",
        initials: "SK",
    },
    {
        name: "Mr. T. Senthil Kumar",
        qualification: "M.C.A.",
        role: "COMPUTER PROGRAMMER",
        bg: "#F0D9B5",
        initials: "TS",
    },
    {
        name: "Mrs. M. Indhumathi",
        qualification: "B.Com.,",
        role: "DATA ENTRY OPERATOR",
        bg: "#8E9AE8",
        initials: "MI",
    },
    {
        name: "Mrs. F.CATHERIN VIMALA",
        qualification: "M.C.A.",
        role: "DATA ENTRY OPERATOR",
        bg: "#F4B4C4",
        initials: "FC",
    },
    {
        name: "Mr. A.MURUGESH KUMAR",
        qualification: "M.Sc.,",
        role: "DATA ENTRY OPERATOR",
        bg: "#4A7FD1",
        initials: "AM",
    },
    {
        name: "Mr. S.R.ARUN SYLVESTER",
        qualification: "M.A., B.Ed.,",
        role: "DATA ENTRY OPERATOR",
        bg: "#F6C9CE",
        initials: "SA",
    },
    {
        name: "MrS. R.JOHNSI RANI",
        qualification: "M.Com., B.Ed.,",
        role: "DATA ENTRY OPERATOR",
        bg: "#7FC7E8",
        initials: "RJ",
    },
    {
        name: "Mr. N. Elangovan",
        qualification: "P.U.C.",
        role: "ACCOUNTANT",
        bg: "#B9CBE0",
        initials: "NE",
    },
    {
        name: "Mr. P.MAHESH",
        qualification: "S.S.L.C",
        role: "OFFICE ASSISTANT",
        bg: "#5AACA6",
        initials: "PM",
    },
];

function Avatar({ bg, initials }) {
    return (
        <div
            style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
            }}
        >
            <span
                style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "0.5px",
                }}
            >
                {initials}
            </span>
        </div>
    );
}

function StaffCard({ person }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "20px 24px",
                border: "1px solid #E7E7E7",
                background: "#FFFFFF",
                textAlign: "left",
            }}
        >
            <Avatar bg={person.bg} initials={person.initials} />
            <div style={{ textAlign: "left" }}>
                <div
                    style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1A1A1A",
                        marginBottom: 6,
                        textAlign: "left",
                    }}
                >
                    {person.name}
                </div>
                <div
                    style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        fontSize: 13,
                        color: "#9A9A9A",
                        marginBottom: 10,
                        textAlign: "left",
                    }}
                >
                    {person.qualification}
                </div>
                <div
                    style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#3E5C86",
                        letterSpacing: "0.3px",
                        textAlign: "left",
                    }}
                >
                    {person.role}
                </div>
            </div>
        </div>
    );
}

export default function Staff() {
    return (
        <div
            style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                background: "#FAFAFA",
                minHeight: "100%",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 32px",
                    borderBottom: "1px solid #E7E7E7",
                    background: "#FFFFFF",
                }}
            >
                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#1A1A1A",
                        margin: 0,
                        textAlign: "left",
                    }}
                >
                    Staff
                </h1>
                <a
                    href="#"
                    style={{
                        fontSize: 14,
                        color: "#3E5C86",
                        textDecoration: "none",
                        fontWeight: 500,
                    }}
                >
                    COE Staff
                </a>
            </div>

            {/* Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 0,
                    maxWidth: 1180,
                    margin: "0 auto",
                    padding: "24px 32px 56px",
                    rowGap: 0,
                }}
            >
                {staff.map((person, i) => (
                    <div
                        key={person.name}
                        style={{
                            marginRight: i % 2 === 0 ? -1 : 0,
                            marginBottom: -1,
                        }}
                    >
                        <StaffCard person={person} />
                    </div>
                ))}
            </div>
        </div>
    );
}