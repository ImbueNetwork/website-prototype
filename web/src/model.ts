import * as config from "./config";


/**
 * Models the milestone data that appears in the /proposals/draft form
 */
export type DraftMilestone = {
    name: string;
    percentage_to_unlock: number;
}
/**
 * Models the data from inputs that appears in the /proposals/draft form
 */
export type DraftProposal = {
    name: string;
    logo: string;
    description: string;
    website: string;
    milestones: DraftMilestone[];
    required_funds: number;
    owner: string;
    imbuer_id?: number;
    chain_project_id?: number;
    category?: string | number;
};

/**
 * Models a "project" saved to the db, but not on chain.
 */
export type Proposal = DraftProposal & {
    id: number;
    status: string;
    imbuer_id: number;
    create_block_number?: number;
    created: string;
    modified: string;
    milestones: Milestone[];
}

/** Models the Project type from the chain */
export type ImbueProject = {
    name: string;
    logo: string;
    description: string;
    website: string;
    milestones: Milestone[];
    contributions: any[]; // in the future, something like `Contribution[]`
    required_funds: number;
    withdrawn_funds: number;
    /// The account that will receive the funds if the campaign is successful
    initiator: string, // public address
    create_block_number: number;
    approved_for_funding: boolean;
}

/**
 * Models a "milestone" saved to the db (and also as it will appear on chain).
 */
export type Milestone = DraftMilestone & {
    milestone_key?: number;
    project_key: number;
    is_approved: boolean;
    created: string;
    modified: string;
};

export type Web3Account = {
    address: string;
};

export type Imbuer = {
    id: number;
    web3Accounts: Web3Account[];
};


/**
 * CRUD Methods 
 */

export const postDraftProposal = (
    proposal: DraftProposal
) => fetch(`${config.apiBase}/projects/`, {
    method: "post",
    headers: config.postAPIHeaders,
    body: JSON.stringify({proposal})
});

export const updateProposal = (
    proposal: DraftProposal,
    id: string | number
) => fetch(`${config.apiBase}/projects/${id}`, {
    method: "put",
    headers: config.postAPIHeaders,
    body: JSON.stringify({proposal})
});

export const fetchProject = (projectId: string) => fetch(
    `${config.apiBase}/projects/${projectId}`,
    {headers: config.getAPIHeaders}
);

/**
 * FIXME: configurable limit, filters, pagination, etc.
 */
export const fetchProjects = () => fetch(
    `${config.apiBase}/projects/`,
    {headers: config.getAPIHeaders}
);


 export const fetchProjectsByImbuerId = (imbuerId: number) => fetch(
    `${config.apiBase}/imbuers/${imbuerId}/projects/`,
    {headers: config.getAPIHeaders}
);