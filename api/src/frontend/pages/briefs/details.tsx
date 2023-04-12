import React, { ChangeEvent, useEffect, useState } from "react";
import ReactDOMClient from "react-dom/client";
import { Brief, User } from "../../models";
import "../../styles/brief-details.css";
import { getBrief } from "../../services/briefsService";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { FaRegShareSquare } from "react-icons/fa";
import { fetchUser, fetchUserOrEmail, getCurrentUser, redirect } from "../../utils";
import ChatPopup from "../../components/chat-popup";
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import ArrowIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import { IoMdWallet } from "react-icons/io";
import { FaHandshake } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { ChatBox } from "../../components";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as config from "../../config";

export type BriefProps = {
    brief: Brief;
};

export const BriefDetails = ({ brief: brief }: BriefProps): JSX.Element => {
    const [browsingUser, setBrowsingUser] = useState<User | null>();
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [showMessageBox, setShowMessageBox] = useState<boolean>(false);
    const isOwnerOfBrief = (browsingUser && browsingUser.id == brief.user_id);
    const isDocumentPresent = (browsingUser && brief.document_url != null);
    const [showSimilarBrief, setShowSimilarBrief] = useState<boolean>(false)
    const [showClientHistory, setShowClientHistory] = useState<boolean>(false)
    const [file, setFile] = useState<File>();
    const [showUploadButton, setShowUploadButton] = useState<boolean>(true);

    // TODO: need to get project category array from the brief
    const projectCategories = ["Product Development", "Health", "Wellness"]

    useEffect(() => {
        async function setup() {
            setBrowsingUser(await getCurrentUser());
            setTargetUser(await fetchUser(brief.user_id));
        }
        setup();
    }, []);

    const timeAgo = new TimeAgo("en-US");
    const timePosted = timeAgo.format(new Date(brief.created));

    const redirectToApply = () => {
        redirect(`briefs/${brief.id}/apply`);
    }

    const onButtonClick = () => {
        // using Java Script method to get PDF file
        fetch(`${config.apiBase}/filehandler/download/${brief.id}`).then(response => {
            response.blob().then(blob => {
                // Creating new object of PDF file
                const fileURL = window.URL.createObjectURL(blob);
                // Setting various property values
                const alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = 'brief.pdf';
                alink.click();
            })
        })
    }



    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = (e) => {
        if (!file) {
            return;
        }
        const formData = new FormData();
        formData.append('brief', file);

        // 👇 Uploading the file using the fetch API to the server
        fetch(`${config.apiBase}/filehandler/${brief.id}/upload`, {
            method: 'POST',
            body: formData,
            // 👇 Set headers manually for single file upload
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
        setShowUploadButton(false);
    };

    const handleMessageBoxClick = async () => {
        if (browsingUser) {
            setShowMessageBox(true);
        } else {
            redirect("login", `/dapp/briefs/${brief.id}/`)
        }
    }

    const BioPanel = (
        <div className="brief-bio py-5 px-10">
            <div className="subsection">
                <div className="header">
                    <h2>{brief.headline}</h2>
                </div>
                <span className="time_posted primary-text mt-3">
                    Posted {timePosted} by {brief.created_by}
                </span>
            </div>

            {/* TODO: Do we use same styles for both buttons? */}
            <div className="subsection">
                <div className="action-buttons">
                    <button className="primary-btn in-dark w-button" onClick={() => redirectToApply()}>
                        Apply
                    </button>
                    {/* TODO: Implement */}
                    {/* <button className="primary-btn in-dark w-button">
                        Save
                    </button> */}
                </div>
            </div>

            {isDocumentPresent &&
                <div className="subsection">
                    <div className="action-buttons">
                        <button className="primary-btn in-dark w-button" onClick={() => onButtonClick()}>
                            Download
                        </button>

                    </div>
                </div>
            }

            {!isDocumentPresent && isOwnerOfBrief && showUploadButton &&
                <div className="subsection" >
                    <div className="action-buttons">
                        <input type="file" onChange={handleFileChange} />
                        {/*<div>{file && `${file.name} - ${file.type}`}</div>*/}

                        <button className="primary-btn in-dark w-button" onClick={handleUploadClick}>Upload</button>
                        {/* <button className="primary-btn in-dark w-button">
                        Save
                    </button> */}
                    </div>
                </div>
            }

            {!isDocumentPresent && isOwnerOfBrief && !showUploadButton &&
                <div className="subsection" >
                    <div className="action-buttons">
                        File Uploaded Successfully
                    </div>
                </div>
            }


            <div className="subsection">
                <h3>Project Description</h3>
                <p className="mt-4">{brief.description}</p>
            </div>

            <div className="subsection">
                <div className="header">
                    <h3>Project Category</h3>
                </div>
                <div className="list-row">
                    {
                        projectCategories?.map((category, index) => (
                            <p className="rounded-full text-black bg-white px-4 py-2" key={index}>
                                {category}
                            </p>
                        ))
                    }
                </div>
            </div>

            <div className="subsection">
                <div className="header">
                    <h3>Key Skills And Requirements</h3>
                </div>
                <div className="list-row">
                    {brief.skills?.map((skill, index) => (
                        <p className="rounded-full text-black bg-white px-4 py-2" key={index}>
                            {skill.name}
                        </p>
                    ))}
                </div>
            </div>

            <div className="subsection">
                <div className="header">
                    <h3>Project Scope</h3>
                </div>
                <span>{brief.scope_level}</span>
            </div>

            <div className="subsection">
                <div className="header">
                    <h3>Experience Level Required</h3>
                </div>
                <span>{brief.experience_level}</span>
            </div>

            <div className="subsection">
                <div className="header">
                    <h3>Estimated Length</h3>
                </div>
                <span>{brief.duration}</span>
            </div>

            <div className="subsection">
                <div className="header">
                    <h3>Total Budget</h3>
                </div>
                <span>${Number(brief.budget).toLocaleString()}</span>
            </div>
        </div>
    );

    const BioInsights = (
        <div className="brief-insights px-10 py-5">
            <div className="subsection">
                <div className="header">
                    <h3>Activities on this job</h3>
                    <div className="flex gap-3 items-center">
                        <button className="primary-btn in-dark w-button flex items-center gap-2" onClick={() => redirectToApply()}>
                            Submit a Proposal <FaRegShareSquare />
                        </button>
                        <button className="primary-btn primary-btn-outlined">
                            Save
                        </button>
                    </div>
                </div>
            </div>

            <div className="subsection">
                <div className="brief-insights-stat">
                    <div className="flex items-center">
                        Applications:<span className="bg-indigo-700 ml-2 h-5 w-5 py-1 px-1.5 cursor-pointer text-xs rounded-full">?</span> <span className="primary-text font-bold ml-2">Less than 5</span>
                    </div>
                </div>
            </div>

            <div className="subsection">
                <div className="brief-insights-stat">
                    <div className="flex items-center">
                        Last viewed by freelancers:<span className="primary-text font-bold ml-2">3 hrs ago</span>
                    </div>
                </div>
            </div>

            <div className="subsection">
                <div className="brief-insights-stat">
                    <div>
                        Currently Interviewing:
                        <span className="primary-text font-bold ml-2">2</span>
                    </div>
                </div>
            </div>

            {/* Fixme: not implemented in figma design */}
            {/* <div className="subsection">
                <div className="brief-insights-stat">
                    <IoMdWallet className="brief-insight-icon" />
                    <h3>
                        Total Spent <span className="primary-text">$250,000</span>
                    </h3>
                </div>
            </div> */}

            <h3>About Client</h3>

            <div className="subsection pb-2">
                <div className="brief-insights-stat flex gap-2 justify-start">
                    <VerifiedIcon className="secondary-icon" />
                    <span className="font-bold">Payment method verified</span>
                    <div>{[...Array(4).keys()].map((star, index) => (<StarIcon className={`${index <= 4 && "primary-icon"}`} />))}</div>
                </div>
            </div>

            <div className="subsection pb-2">
                <div className="brief-insights-stat flex flex-col">
                    <div className="flex items-center">
                        <MarkEmailUnreadOutlinedIcon />
                        <h3 className="ml-3">
                            <span className="mr-2">{brief.number_of_briefs_submitted}</span>
                            Projects Posted
                        </h3>
                    </div>
                    <p className="mt-2 text-gray-200">1 hire rate, one open job </p>
                </div>
            </div>

            <div className="subsection pb-2">
                <div className="brief-insights-stat flex flex-col">
                    <div className="flex items-center">
                        <img className="h-4 w-6 object-cover" src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="" />
                        <h3 className="ml-3">
                            United States
                        </h3>
                    </div>
                    <p className="mt-2 text-gray-200">Member since Feb 19, 2023</p>
                </div>
            </div>

            {!isOwnerOfBrief &&
                <div className="mt-auto">
                    <hr className="separator" />
                    <div className="flex flex-col gap-4 mt-5">
                        <div className="w-full flex gap-3 items-center justify-between">
                            <span className="text-xl">
                                Meet the hiring team
                            </span>
                            <button onClick={() => handleMessageBoxClick()} className="primary-btn in-dark w-button" style={{ marginTop: 0 }}>Message</button>
                        </div>
                        <h3>Job Link</h3>
                        <div className="w-full h-12 p-3 bg-[#1A1A18] my-2 rounded-md">
                            <span>http://www.imbue.com</span>
                        </div>
                        <span className="primary-text font-bold cursor-pointer">Copy Link</span>
                    </div>
                    {browsingUser && showMessageBox && <ChatPopup {...{ showMessageBox, setShowMessageBox, targetUser, browsingUser }} />}
                </div>
            }
        </div>
    );

    const ClientHistory = (
        <div className="transparent-conatainer relative">
            <div className="flex justify-between w-full">
                <h3>Client Contact History (4)</h3>
                <div className={`transition transform ease-in-out duration-600 ${showClientHistory && "rotate-180"} cursor-pointer`}>
                    <ArrowIcon onClick={() => setShowClientHistory(!showClientHistory)} className="scale-150" />
                </div>
            </div>
            <div className={`${!showClientHistory && "hidden"} my-6`}>
                <hr className="separator" />
                {/* FIXME: replace dummy array with client history data*/}
                {
                    [...Array(3).keys()].map((history, index) => (
                        <div className="similar-brief">
                            <div className="flex flex-col gap-5">
                                <h3>Imbue Project</h3>
                                <div className="flex items-center">
                                    {[...Array(4).keys()].map((star, index) => (<StarIcon className={`${index <= 4 && "primary-icon"}`} />))}
                                    <span className="ml-3">
                                        Thanks for choosing me. All the best for your future works...
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5">
                                <p>January 24 , 2033</p>
                                <p>Budget $5000</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            {showClientHistory && <span className="primary-text font-bold absolute bottom-2 right-4 cursor-pointer">View more (1)</span>}
        </div>
    );

    const SimilarProjects = (
        <div className="transparent-conatainer relative">
            <div className="flex justify-between w-full">
                <h3>Similar projects on Imbue</h3>
                <div className={`transition transform ease-in-out duration-600 ${showSimilarBrief && "rotate-180"} cursor-pointer`}>
                    <ArrowIcon onClick={() => setShowSimilarBrief(!showSimilarBrief)} className="scale-150" />
                </div>
            </div>

            <div className={`${!showSimilarBrief && "hidden"} my-6`}>
                <hr className="separator" />
                {/* TODO: Need an object for the list of similar projects */}
                {/* FIXME: missing {key} */}
                {/* FIXME: replace dummy array with similar projects data*/}
                {
                    [...Array(3).keys()].map((history, index) => (
                        <div className="similar-brief">
                            <div className="similar-brief-details">
                                <h3>NFT Mining</h3>
                                <span>
                                    Hi guys, I have an NFT I would like to design. The NFT
                                    has to have a picture of......
                                </span>
                            </div>
                            <button className="primary-btn in-dark w-button">
                                View Brief
                            </button>
                        </div>
                    ))
                }
            </div>
            {showSimilarBrief && <span className="primary-text font-bold absolute bottom-2 right-4 cursor-pointer">View more (1)</span>}
        </div>
    );

    return (
        <div className="brief-details-container">
            <div className="brief-info">
                {/* TODO: Implement */}
                {BioPanel}
                {BioInsights}
            </div>
            {ClientHistory}
            {SimilarProjects}
        </div>
    );
};

document.addEventListener("DOMContentLoaded", async (event) => {
    let paths = window.location.pathname.split("/");
    let briefId = paths.length >= 2 && parseInt(paths[paths.length - 2]);

    if (briefId) {
        const brief: Brief = await getBrief(briefId);
        ReactDOMClient.createRoot(
            document.getElementById("brief-details")!
        ).render(<BriefDetails brief={brief} />);
    }
});
