import { createBrowserRouter } from "react-router";
import Landing from "./features/landing/pages/Landing";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import Chat from "./features/chat/pages/Chat";
import ResumeTemplate from "./features/resumeTemplate/pages/ResumeTemplate";
import InterviewPractice from "./features/interviewPractice/pages/InterviewPractice";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/dashboard",
        element: <Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/chat/:interviewId",
        element: <Protected><Chat /></Protected>
    },
    {
        path: "/chat",
        element: <Protected><Chat /></Protected>
    },
    {
        path: "/interview-practice/:interviewId",
        element: <Protected><InterviewPractice /></Protected>
    },
    {
        path: "/interview-practice",
        element: <Protected><InterviewPractice /></Protected>
    },
    {
        path: "/resume-template",
        element: <Protected><ResumeTemplate /></Protected>
    },
    {
        path: "/resume-template/:interviewId",
        element: <Protected><ResumeTemplate /></Protected>
    },
    {
        path: "/resume",
        element: <Protected><ResumeTemplate /></Protected>
    },
    {
        path: "/resume/:interviewId",
        element: <Protected><ResumeTemplate /></Protected>
    }
])
