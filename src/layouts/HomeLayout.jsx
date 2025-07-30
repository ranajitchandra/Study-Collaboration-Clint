import { Outlet } from "react-router";
import BannerSection from "../pages/home/Banner";
import AvailableStudySessions from "../pages/home/Study";
import UpcomingSessions from "../pages/home/UpCommingSession";
import TopRatedSessions from "../pages/home/TopratedSession";
import StudentSuccessStories from "../pages/home/SuccessHistory";
import UserStatsSection from "../pages/home/CountUp";
import Slider from "../pages/home/Slider";



export default function HomeLayout(){

    return (
        <>
            <Slider></Slider>
            <AvailableStudySessions></AvailableStudySessions>
            <TopRatedSessions></TopRatedSessions>
            <StudentSuccessStories></StudentSuccessStories>
            <UserStatsSection></UserStatsSection>
            <BannerSection></BannerSection>
            <Outlet></Outlet>
        </>
    )
}