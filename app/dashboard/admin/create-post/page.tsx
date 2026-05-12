// import CreatePostForm from "@/components/CreatePostForm";
"use client";
import FilterBar from "@/components/FilterBar";

export default function createPost() {
    return (
        <>
            {/* <CreatePostForm /> */}
            <FilterBar
                onChange={(filters) => {
                    console.log("Selected filters:", filters);
                }}
            />
        </>
    )
}