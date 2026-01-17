import {useState} from "react";
import axios from "axios";
export default function AITutor(){
  const [q,setQ]=useState("");
  const [a,setA]=useState("");
  const ask=async()=>{
    const r=await axios.post("http://ai-it-training-server.onrender.com/api/ai",{question:q});
    setA(r.data.answer);
  };
  return <>
    <input onChange={e=>setQ(e.target.value)}/>
    <button onClick={ask}>Ask</button>
    <p>{a}</p>
  </>;
}
