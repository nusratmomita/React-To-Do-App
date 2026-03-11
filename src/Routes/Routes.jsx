import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import { Component } from "react";
import MyTasks from "../Pages/MyTasks";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                path: "/",
                Component: MyTasks
            },
        ]
    }
])