import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContextProvider";
import MyStudySessionsTable from "./MyStudySessionTable";
import Loading from "../../../components/Loading";

export default function MyStudySessions() {
    const { user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        setLoading(true);
        axios
            .get("http://localhost:3000/study-sessions", {
                params: { email: user.email },
                withCredentials: true,
            })
            .then((res) => setSessions(res.data))
            .catch((err) => {
                console.error("Failed to fetch sessions:", err);
                setSessions([]);
            })
            .finally(() => setLoading(false));
    }, [user?.email]);

    if (loading) return <div><Loading></Loading></div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Study Sessions</h1>
            <MyStudySessionsTable sessions={sessions}></MyStudySessionsTable>
        </div>
    );
}
