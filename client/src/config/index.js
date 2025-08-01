export const signupFormControls = [
    {
        name: 'username',
        label: 'Username',
        placeholder: 'Enter your username',
        type: 'text',
        componentType: 'input'
    },
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        type: 'email',
        componentType: 'input'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        componentType: 'input'
    }
]
export const signInFormControls = [
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        type: 'text',
        componentType: 'input'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        componentType: 'input'
    }
]
export const initialSignUpFormData = {
    username: "",
    email: "",
    password: ""
}
export const initialSignInFormData = {
    email: "",
    password: ""
}


export const courseLevelOptions = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
];

export const courseCategories = [
    { id: "web-development", label: "Web Development" },
    { id: "backend-development", label: "Backend Development" },
    { id: "data-science", label: "Data Science" },
    { id: "machine-learning", label: "Machine Learning" },
    { id: "artificial-intelligence", label: "Artificial Intelligence" },
    { id: "cloud-computing", label: "Cloud Computing" },
    { id: "cyber-security", label: "Cyber Security" },
    { id: "mobile-development", label: "Mobile Development" },
    { id: "game-development", label: "Game Development" },
    { id: "software-engineering", label: "Software Engineering" },
];

export const courseLandingPageFormControls = [
    {
        name: "title",
        label: "Title",
        componentType: "input",
        type: "text",
        placeholder: "Enter course title",
    },
    {
        name: "category",
        label: "Category",
        componentType: "select",
        type: "text",
        placeholder: "",
        options: courseCategories,
    },
    {
        name: "level",
        label: "Level",
        componentType: "select",
        type: "text",
        placeholder: "",
        options: courseLevelOptions,
    },
    {
        name: "subtitle",
        label: "Subtitle",
        componentType: "input",
        type: "text",
        placeholder: "Enter course subtitle",
    },
    {
        name: "description",
        label: "Description",
        componentType: "textarea",
        type: "text",
        placeholder: "Enter course description",
    },
    {
        name: "pricing",
        label: "Pricing",
        componentType: "input",
        type: "number",
        placeholder: "Enter course pricing",
    },
    {
        name: "objectives",
        label: "Objectives",
        componentType: "textarea",
        type: "text",
        placeholder: "Enter course objectives",
    },
    {
        name: "welcomeMessage",
        label: "Welcome Message",
        componentType: "textarea",
        placeholder: "Welcome message for students",
    },
];

export const courseLandingInitialFormData = {
    title: "",
    category: "",
    level: "",
    primaryLanguage: "",
    subtitle: "",
    description: "",
    pricing: "",
    objectives: "",
    welcomeMessage: "",
    image: "",
};

export const courseCurriculumInitialFormData = [
    {
        title: "",
        videoUrl: "",
        freePreview: false,
        public_id: "",
    },
];

export const sortOptions = [
    {id: "rate", label: "Rate"},
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
];

export const filterOptions = {
    category: courseCategories,
    level: courseLevelOptions,
};