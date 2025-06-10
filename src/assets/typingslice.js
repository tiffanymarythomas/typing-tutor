import {createSlice} from "@reduxjs/toolkit"

const typingSlice=createSlice({
    name:"typing",
    initialState:{
        status:"not_started"
    },
    reducers:{
        notStarted:state=>{
            state.status="not_started"
        },
        inProgress:state=>{
            state.status="in_progress"
        },
        finished:state=>{
            state.status="finished"
        }
    }
})

export const {inProgress,finished,notStarted}=typingSlice.actions

export default typingSlice.reducer;