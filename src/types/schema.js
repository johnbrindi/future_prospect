export const Json = {
    string: '',
    number: 0,
    boolean: false,
    null: null,
    object: {},
    array: []
  };
  
  export const Database = {
    public: {
      Tables: {
        companies: {
          Row: {
            id: '',
            name: '',
            industry: '',
            location: '',
            about: '',
            logo_url: null,
            website: null,
            created_at: '',
            user_id: ''
          },
          Insert: {
            id: '',
            name: '',
            industry: '',
            location: '',
            about: '',
            logo_url: null,
            website: null,
            created_at: '',
            user_id: ''
          },
          Update: {
            id: '',
            name: '',
            industry: '',
            location: '',
            about: '',
            logo_url: null,
            website: null,
            created_at: '',
            user_id: ''
          }
        },
        internships: {
          Row: {
            id: '',
            title: '',
            description: '',
            location: '',
            type: "Remote",
            company_id: '',
            created_at: '',
            duration: '',
            requirements: [],
            responsibilities: [],
            is_active: false,
            deadline: null
          },
          Insert: {
            id: '',
            title: '',
            description: '',
            location: '',
            type: "Remote",
            company_id: '',
            created_at: '',
            duration: '',
            requirements: [],
            responsibilities: [],
            is_active: false,
            deadline: null
          },
          Update: {
            id: '',
            title: '',
            description: '',
            location: '',
            type: "Remote",
            company_id: '',
            created_at: '',
            duration: '',
            requirements: [],
            responsibilities: [],
            is_active: false,
            deadline: null
          }
        },
        applications: {
          Row: {
            id: '',
            internship_id: '',
            student_id: '',
            status: "pending",
            created_at: '',
            resume_url: null,
            cover_letter: null,
            notes: null
          },
          Insert: {
            id: '',
            internship_id: '',
            student_id: '',
            status: "pending",
            created_at: '',
            resume_url: null,
            cover_letter: null,
            notes: null
          },
          Update: {
            id: '',
            internship_id: '',
            student_id: '',
            status: "pending",
            created_at: '',
            resume_url: null,
            cover_letter: null,
            notes: null
          }
        },
        students: {
          Row: {
            id: '',
            full_name: '',
            university: '',
            department: '',
            bio: null,
            avatar_url: null,
            resume_url: null,
            created_at: '',
            user_id: '',
            skills: []
          },
          Insert: {
            id: '',
            full_name: '',
            university: '',
            department: '',
            bio: null,
            avatar_url: null,
            resume_url: null,
            created_at: '',
            user_id: '',
            skills: []
          },
          Update: {
            id: '',
            full_name: '',
            university: '',
            department: '',
            bio: null,
            avatar_url: null,
            resume_url: null,
            created_at: '',
            user_id: '',
            skills: []
          }
        },
        messages: {
          Row: {
            id: '',
            sender_id: '',
            receiver_id: '',
            content: '',
            created_at: '',
            read: false
          },
          Insert: {
            id: '',
            sender_id: '',
            receiver_id: '',
            content: '',
            created_at: '',
            read: false
          },
          Update: {
            id: '',
            sender_id: '',
            receiver_id: '',
            content: '',
            created_at: '',
            read: false
          }
        },
        profiles: {
          Row: {
            id: '',
            user_id: '',
            type: "student",
            created_at: ''
          },
          Insert: {
            id: '',
            user_id: '',
            type: "student",
            created_at: ''
          },
          Update: {
            id: '',
            user_id: '',
            type: "student",
            created_at: ''
          }
        }
      },
      Views: {},
      Functions: {},
      Enums: {}
    }
  };