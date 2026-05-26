export interface User {
    id: string
    name: string
    role: string
    created_at: string
    engagementCount?: number
    lastActivity?: string
    engagements?: {
        created_at: string
        post_title: string
    }[]
}

export interface Action {
  id: string
  delivery_note: string
  liked: boolean
  created_at: string
  updated_at: string
  user_id: string
  profiles?: { name: string }
}

export interface Assignment {
  user_id: string
  profiles?: { name: string }
}

export interface Post {
  id: string
  title: string
  content: string
  due_date: string | null
  assignment_scope: "ALL" | "SPECIFIC"
  created_at: string
  post_actions: Action[]
  post_assignments: Assignment[]
}

export interface Props {
  posts: Post[]
  role: "ADMIN" | "ASSOCIATE"
  userId: string
}


export interface Associate {
  id: string
  name: string
}

export interface CreateFormPost {
  id: string
  title: string
  content: string
  due_date: string | null
}

export interface CreateFormProps {
  editPost?: CreateFormPost        // if passed, form is in edit mode
  onClose?: () => void  // called after save (for modal usage)
}
