
training_data = [
    # Greeting
    {
        "intent": "greeting",
        "patterns": [
            "Hello",
            "Hi",
            "Hey",
            "Good morning",
            "Good evening",
            "How are you",
            "Is anyone there?",
            "Good afternoon",
            "Hi there",
            "Hello there",
            "Hey assistant",
            "Hey chatbot",
            "Greetings",
            "How is your day?",
            "Are you available?",
            "Can you help me?",
            "What's up?",
            "Nice to meet you",
            "Good day",
            "Anyone available to chat?"
        ],
        "response": "Hello! Welcome to Community Connect. How can I help you today?"
    },

    # Help requests
    {
        "intent": "create_help_request",
        "patterns": [
            "How can I request help?",
            "I need some help",
            "I want to create a help request",
            "How do I ask for assistance?",
            "Can someone help me?",
            "I need food assistance",
            "Where can I post my problem?",
            "I need help with my daily needs",
            "I am looking for some support",
            "I have a problem and need assistance",
            "How do I submit a new request?",
            "I want to ask the community for help",
            "Can I get help from a volunteer?",
            "I need someone to assist me",
            "Where do I submit my help application?",
            "I am facing a difficult situation",
            "I need educational support",
            "I need clothes for my family",
            "I need medical assistance",
            "How do I post a request for help?"
        ],
        "response": "You can create a help request from your Member Dashboard. Select My Help Requests and click Create Request. Fill in the details and submit it."
    },

    # Volunteer
    {
        "intent": "volunteer",
        "patterns": [
            "How can I become a volunteer?",
            "I want to volunteer",
            "How do I help people?",
            "Can I register as a volunteer?",
            "I want to join as a volunteer",
            "How can I offer my service?",
            "I want to help my community",
            "How do I sign up to volunteer?",
            "I am interested in helping others",
            "How can I provide assistance to people?",
            "I want to work as a community volunteer",
            "Where can I find volunteer opportunities?",
            "How do I turn on my availability?",
            "How can I receive help requests as a volunteer?",
            "I want to support people in need",
            "Can I join the volunteer team?",
            "How do I become a registered volunteer?",
            "I want to contribute my time to society",
            "How can I serve my community?",
            "I would like to assist people who need help"
        ],
        "response": "You can register on Community Connect using the Volunteer role. After logging in, visit your Volunteer Dashboard and switch your availability on to receive help requests."
    },

    # Request status
    {
        "intent": "check_request_status",
        "patterns": [
            "How can I check my request?",
            "What is the status of my request?",
            "Has anyone accepted my request?",
            "I want to track my request",
            "Where can I see my requests?",
            "Did a volunteer accept my request?",
            "Has my help request been assigned?",
            "I want to know whether my request is approved",
            "How do I see my request details?",
            "Is anyone working on my request?",
            "When will a volunteer accept my request?",
            "Where can I track the progress?",
            "How do I know if my request is completed?",
            "Can I see my previous help requests?",
            "My request is still pending",
            "Has someone responded to my request?",
            "How can I find my accepted requests?",
            "I want to check my help request history",
            "Who is helping me with my request?",
            "How do I know my request status?"
        ],
        "response": "Open your Member Dashboard and select My Help Requests. You can view the status and assigned volunteer there."
    },

    # Community sharing
    {
        "intent": "community_sharing",
        "patterns": [
        "How can I share an item?",
        "I want to donate something",
        "How does community sharing work?",
        "I have an old item to give away",
        "Can I share unused things?",
        "How can I get a shared item?",
        "I want to give away my old clothes",
        "Where can I post items I no longer need?",
        "How do I upload an item for sharing?",
        "I have some useful things to donate",
        "Can someone take my unused furniture?",
        "How do I express interest in an item?",
        "I need an item shared by another member",
        "Where can I find donated items?",
        "How can I give my belongings to someone?",
        "I want to share a school bag",
        "Can I offer my old books to others?",
        "How do I choose someone to receive my item?",
        "I want to find free items in the community",
        "How does the item sharing process work?"
        ],
        "response": "Visit Community Sharing from your Member Dashboard. You can post an item you no longer need, or express interest in an item shared by another member."
    },

    # Events
    {   
        "intent": "event_registration",
        "patterns": [
        "How can I register for an event?",
        "What events are available?",
        "I want to join an event",
        "Where can I see community events?",
        "How do I participate in an event?",
        "Can volunteers join events?",
        "I want to attend a blood donation camp",
        "Show me upcoming events",
        "Are there any events happening?",
        "How can I participate in a blood donation drive?",
        "I want to register for a community programme",
        "Where can I find event details?",
        "Can I volunteer for an event?",
        "I am interested in joining a community event",
        "How do I see registered events?",
        "Tell me about upcoming programmes",
        "I want to attend an education camp",
        "Is there any health awareness programme?",
        "How do I cancel my event registration?",
        "Where can I see my event registrations?"
        ],
    "response": "Open Community Events from your dashboard. Browse available events and select Register for Event. You can view your registrations under My Event Registrations."
    },

    # Account
    {
        "intent": "account",
        "patterns": [
            "How can I create an account?",
            "How do I register?",
            "I want to sign up",
            "How can I log in?",
            "I forgot how to access my account",
            "How do I change my password?",
            "How can I create a new profile?",
            "Where is the registration page?",
            "I am a new user",
            "How do I sign into Community Connect?",
            "I cannot log into my account",
            "How can I reset my password?",
            "What details are needed for registration?",
            "Can I register as a community member?",
            "How do I update my account information?",
            "I want to create a volunteer account",
            "How can an organization register?",
            "I already have an account",
            "Why can't I access my dashboard?",
            "How do I get started with Community Connect?"
        ],
        "response": "You can create an account using the Register option on the login page. Choose the appropriate role and complete the registration form."
    },

    # Thanks
    {
        "intent": "thanks",
        "patterns": [
            "Thank you",
            "Thanks",
            "That's helpful",
            "Thank you so much",
            "I appreciate your help",
            "Thanks a lot",
            "Many thanks",
            "That was useful",
            "You helped me a lot",
            "I am grateful",
            "I really appreciate it",
            "Thanks for the information",
            "That answers my question",
            "Thank you for explaining",
            "You are very helpful",
            "I appreciate your support",
            "That was very useful",
            "Thanks for your assistance",
            "I got the information I needed",
            "Much appreciated"
        ],
        "response": "You're welcome! I'm happy to help. Feel free to ask me anything about Community Connect."
    },

    # Goodbye
    {
        "intent": "goodbye",
        "patterns": [
            "Bye",
            "Goodbye",
            "See you later",
            "That's all",
            "Have a nice day",
            "See you soon",
            "Talk to you later",
            "I have to go",
            "I am leaving now",
            "Bye for now",
            "Catch you later",
            "Thanks, goodbye",
            "I will come back later",
            "See you next time",
            "Have a good day",
            "Have a great evening",
            "I am done chatting",
            "That's everything I wanted to know",
            "I will talk to you again",
            "Good night"
        ],
        "response": "Thank you for using Community Connect. Have a wonderful day!"
    }
]
