import { Outlet } from "react-router";
import BannerSection from "../pages/home/Banner";
import AvailableStudySessions from "../pages/home/Study";



export default function HomeLayout(){

    return (
        <>
            <BannerSection></BannerSection>
            <AvailableStudySessions></AvailableStudySessions>
            <Outlet></Outlet>
        </>
    )
}