import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

export default function Quiz(){
  const {id}=useParams();
  const [q,setQ]=useState([]);
  const [score,setScore]=useState(0);

  useEffect(()=>{
    axios.get("http://ai-it-training-server.onrender.com/api/quiz/"+id).then(r=>setQ(r.data));
  },[]);

  const check=(s,c)=>{ if(s===c) setScore(score+1); };

  return <>
    {q.map((x,i)=>(
      <div key={i}>
        <p>{x.question}</p>
        {x.options.map((o,j)=>(
          <button onClick={()=>check(j,x.correct)}>{o}</button>
        ))}
      </div>
    ))}
    <h3>Score: {score}</h3>
  </>;
}
