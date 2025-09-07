import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Document {
  id: string
  name: string
  type: string
  uploadedAt: string
  analysisResult?: AnalysisResult
}

interface AnalysisResult {
  riskScore: number
  redFlags: RedFlag[]
  summary: string
  clauses: Clause[]
}

interface RedFlag {
  id: string
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  clause: string
}

interface Clause {
  id: string
  text: string
  risk: 'low' | 'medium' | 'high'
  explanation: string
}

interface UserContext {
  age: number
  location: string
  purpose: string
}

interface DocumentState {
  documents: Document[]
  currentDocument: Document | null
  analysisLoading: boolean
  uploadLoading: boolean
  userContext: UserContext | null
  riskHistory: { date: string; score: number }[]
  error: string | null
}

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  analysisLoading: false,
  uploadLoading: false,
  userContext: null,
  riskHistory: [
    { date: '2025-01-01', score: 45 },
    { date: '2025-01-15', score: 62 },
    { date: '2025-01-30', score: 38 },
  ],
  error: null
}

export const uploadDocument = createAsyncThunk(
  'document/upload',
  async ({ file, context }: { file: File; context: UserContext }) => {
    // Placeholder for file upload API
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }
  }
)

export const analyzeDocument = createAsyncThunk(
  'document/analyze',
  async (documentId: string) => {
    // Placeholder for analysis API
    await new Promise(resolve => setTimeout(resolve, 3000))
    return {
      riskScore: Math.floor(Math.random() * 100),
      redFlags: [
        {
          id: '1',
          severity: 'high' as const,
          title: 'Automatic Renewal Clause',
          description: 'Contract automatically renews without explicit consent',
          clause: 'This agreement shall automatically renew for successive terms...'
        },
        {
          id: '2',
          severity: 'medium' as const,
          title: 'Liability Limitation',
          description: 'Limits company liability in case of damages',
          clause: 'Company liability shall not exceed the amount paid...'
        }
      ],
      summary: 'This employment contract contains several standard clauses with moderate risk exposure.',
      clauses: [
        {
          id: '1',
          text: 'Employee agrees to work exclusively for the company...',
          risk: 'medium' as const,
          explanation: 'Non-compete clause may limit future employment opportunities'
        }
      ]
    }
  }
)

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setCurrentDocument: (state, action) => {
      state.currentDocument = action.payload
    },
    setUserContext: (state, action) => {
      state.userContext = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload cases
      .addCase(uploadDocument.pending, (state) => {
        state.uploadLoading = true
        state.error = null
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploadLoading = false
        state.documents.push(action.payload)
        state.currentDocument = action.payload
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploadLoading = false
        state.error = action.error.message || 'Upload failed'
      })
      // Analysis cases
      .addCase(analyzeDocument.pending, (state) => {
        state.analysisLoading = true
        state.error = null
      })
      .addCase(analyzeDocument.fulfilled, (state, action) => {
        state.analysisLoading = false
        if (state.currentDocument) {
          state.currentDocument.analysisResult = action.payload
          const docIndex = state.documents.findIndex(d => d.id === state.currentDocument!.id)
          if (docIndex !== -1) {
            state.documents[docIndex] = state.currentDocument
          }
        }
      })
      .addCase(analyzeDocument.rejected, (state, action) => {
        state.analysisLoading = false
        state.error = action.error.message || 'Analysis failed'
      })
  }
})

export const { setCurrentDocument, setUserContext, clearError } = documentSlice.actions
export default documentSlice.reducer