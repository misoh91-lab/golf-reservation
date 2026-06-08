const API_URL = "https://script.google.com/macros/s/AKfycbxlkww-MS20egbTaEnIhXaP3XAbxoKTHbw-7-eUKRXc1HXvjIjpTByMTr6v-3EbuZ2k/exec";
const ADMIN_PASSWORD = "golf1234";
const COURSES = ["코리아", "크리스탈밸리", "설해원"];
const COURSE_COLORS = { "코리아": "#1a5c2e", "크리스탈밸리": "#1a3a6e", "설해원": "#8b1a1a" };
const COURSE_BG    = { "코리아": "#e8f5e0", "크리스탈밸리": "#e3ecfa", "설해원": "#faeaea" };
const COURSE_URLS  = {
  "코리아": "https://www.gakorea.com/index.asp",
  "크리스탈밸리": "https://www.crystalvalley.co.kr/index.asp",
  "설해원": "https://www.seolhaeone.com/member/login_new.do?redirect=/reservation/golf-day_new.do",
};
const COURSE_NOTICES = {
  "코리아":      { title: "코리아CC 예약 안내",    msg: "코리아CC의 경우 예약신청일 전월 20일에 확정 여부 확인 가능합니다." },
  "크리스탈밸리": { title: "크리스탈밸리 예약 안내", msg: "크리스탈밸리의 경우 예약신청일 전월 2주차 화요일에 확정 여부 확인 가능합니다." },
  "설해원":      { title: "설해원 예약 안내",       msg: "설해원의 경우 예약신청일 전월 1주차 내 확정 여부 확인 가능합니다." },
};
const STATUS = {
  pending:   { label: "대기중", color: "#b87d00", bg: "#fff8e1" },
  confirmed: { label: "확정",   color: "#1a6e3a", bg: "#e8f5e9" },
  cancelled: { label: "취소",   color: "#b71c1c", bg: "#ffebee" },
};
const timeSlots = ["06:00","07:00","08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"];

const inputStyle = (err) => ({
  width:"100%", padding:"9px 12px", fontSize:14,
  border:`1px solid ${err?"#e53935":"#c8d8c0"}`,
  borderRadius:8, outline:"none", boxSizing:"border-box",
  background:"#fff", color:"#1a2e1a", fontFamily:"inherit"
});
const labelStyle = { fontSize:13, fontWeight:500, color:"#4a6741", marginBottom:4, display:"block" };
const errStyle   = { color:"#e53935", fontSize:11, marginTop:2 };
const btnPrimary = { padding:"11px", background:"#2e6b2e", color:"#fff", border:"none", borderRadius:9, fontSize:15, fontWeight:600, cursor:"pointer", width:"100%" };

function MiniCalendar({ reservations, selectedDate, onSelect }) {
  const today = new Date();
  const [vy, setVy] = React.useState(today.getFullYear());
  const [vm, setVm] = React.useState(today.getMonth());
  const first = new Date(vy, vm, 1).getDay();
  const days  = new Date(vy, vm+1, 0).getDate();
  const resMap = {};
  reservations.filter(r=>r.status!=="cancelled").forEach(r=>{
    const d = String(r.date||"").replace(/^'/,"").substring(0,10);
    if(!resMap[d]) resMap[d]=[];
    resMap[d].push(r.course);
  });
  const cells = [...Array(first).fill(null), ...Array.from({length:days},(_,i)=>i+1)];
  const mn = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const wk = ["일","월","화","수","목","금","토"];
  return (
    <div style={{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:12,padding:12,minWidth:200,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <button onClick={()=>{ if(vm===0){setVm(11);setVy(y=>y-1);}else setVm(m=>m-1); }} style={{background:"none",border:"none",cursor:"pointer",color:"#2e6b2e",fontSize:16,padding:"2px 6px"}}>‹</button>
        <span style={{fontSize:13,fontWeight:600,color:"#1a4a1a"}}>{vy}년 {mn[vm]}</span>
        <button onClick={()=>{ if(vm===11){setVm(0);setVy(y=>y+1);}else setVm(m=>m+1); }} style={{background:"none",border:"none",cursor:"pointer",color:"#2e6b2e",fontSize:16,padding:"2px 6px"}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
        {wk.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:"#9ab890",fontWeight:600,padding:"2px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((day,i)=>{
          if(!day) return <div key={`e${i}`}/>;
          const ds=`${vy}-${String(vm+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isToday=vy===today.getFullYear()&&vm===today.getMonth()&&day===today.getDate();
          const isSel=ds===selectedDate;
          return (
            <div key={day} onClick={()=>onSelect&&onSelect(ds)}
              style={{textAlign:"center",padding:"4px 2px",borderRadius:6,fontSize:11,fontWeight:isToday?700:400,
                background:isSel?"#2e6b2e":isToday?"#c8e8b8":"transparent",
                color:isSel?"#fff":isToday?"#1a4a1a":"#2a3a2a",cursor:onSelect?"pointer":"default"}}>
              {day}
              {resMap[ds]&&!isSel&&(
                <div style={{display:"flex",justifyContent:"center",gap:1,marginTop:1}}>
                  {resMap[ds].slice(0,3).map((c,ci)=>(
                    <div key={ci} style={{width:4,height:4,borderRadius:"50%",background:COURSE_COLORS[c]||"#2e6b2e"}}/>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{marginTop:10,borderTop:"1px solid #c8e0be",paddingTop:8}}>
        {COURSES.map(c=>(
          <div key={c} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:COURSE_COLORS[c],flexShrink:0}}/>
            <span style={{fontSize:11,color:"#4a6741"}}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = React.useState(true);
  const [saving,  setSaving]  = React.useState(false);
  const [page, setPage] = React.useState("home");
  const [reservations, setReservations] = React.useState([]);
  const [form, setForm] = React.useState({empId:"",name:"",dept:"",userEmpId:"",userEmpName:"",userDept:"",date:"",time:"",course:"",note:"",pw:"",pwConfirm:""});
  const [errors, setErrors] = React.useState({});
  const [empLoading, setEmpLoading] = React.useState(false);
  const [userEmpLoading, setUserEmpLoading] = React.useState(false);
  const [courseNotice, setCourseNotice] = React.useState(null);
  const [dateConflict, setDateConflict] = React.useState(null);
  const [lookupEmpId, setLookupEmpId] = React.useState("");
  const [lookupName,  setLookupName]  = React.useState("");
  const [lookupDept,  setLookupDept]  = React.useState("");
  const [lookupEmpLoading, setLookupEmpLoading] = React.useState(false);
  const [lookupPw,    setLookupPw]    = React.useState("");
  const [lookupError, setLookupError] = React.useState("");
  const [myRes, setMyRes] = React.useState(null);
  const [adminPw, setAdminPw] = React.useState("");
  const [adminError, setAdminError] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [calSel, setCalSel] = React.useState("");

  // 데이터 로드
  React.useEffect(()=>{
    (async()=>{
      try {
        const res = await fetch(`${API_URL}?action=getAll`);
        const data = await res.json();
        if(Array.isArray(data)) setReservations(data);
      } catch(e){ console.error(e); }
      finally{ setLoading(false); }
    })();
  },[]);

  const setF = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:""})); };

  // 직원 조회 함수 (먼저 정의)
  const fetchEmployee = async (empId, type) => {
    if(!empId.trim()) return;
    type==="user" ? setUserEmpLoading(true) : setEmpLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=getEmployee&empId=${empId}`);
      const data = await res.json();
      if(data.success) {
        if(type==="user") setForm(f=>({...f,userEmpName:data.name,userDept:data.dept}));
        else setForm(f=>({...f,name:data.name,dept:data.dept}));
      } else {
        if(type==="user") setForm(f=>({...f,userEmpName:"",userDept:""}));
        else setForm(f=>({...f,name:"",dept:""}));
      }
    } catch(e){ console.error(e); }
    type==="user" ? setUserEmpLoading(false) : setEmpLoading(false);
  };

  const fetchLookupEmployee = async (empId) => {
    if(!empId || !empId.trim()) return;
    setLookupEmpLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=getEmployee&empId=${empId}`);
      const data = await res.json();
      if(data.success){ setLookupName(data.name); setLookupDept(data.dept); }
      else { setLookupName(""); setLookupDept(""); setLookupError("사번을 찾을 수 없습니다."); }
    } catch(e){ console.error(e); }
    setLookupEmpLoading(false);
  };

  // 자동조회 useEffect (함수 정의 후)
  React.useEffect(()=>{
    if(!form.empId.trim()){ setForm(f=>({...f,name:"",dept:""})); return; }
    const t = setTimeout(()=>fetchEmployee(form.empId,"applicant"),500);
    return ()=>clearTimeout(t);
  },[form.empId]);

  React.useEffect(()=>{
    if(!form.userEmpId.trim()){ setForm(f=>({...f,userEmpName:"",userDept:""})); return; }
    const t = setTimeout(()=>fetchEmployee(form.userEmpId,"user"),500);
    return ()=>clearTimeout(t);
  },[form.userEmpId]);

  React.useEffect(()=>{
    if(!lookupEmpId.trim()){ setLookupName(""); setLookupDept(""); return; }
    const t = setTimeout(()=>fetchLookupEmployee(lookupEmpId),500);
    return ()=>clearTimeout(t);
  },[lookupEmpId]);

  const checkDateConflict = (d) => {
    const conflicts = reservations.filter(r=>{
      if(String(r.status).replace(/^'/,"") === "cancelled") return false;
      const rd = String(r.date||"").replace(/^'/,"").substring(0,10);
      return rd === d;
    });
    setDateConflict(conflicts.length > 0 ? conflicts.length : null);
  };

  const validate = () => {
    const e={};
    if(!form.empId.trim())       e.empId="신청자 사번을 입력해주세요.";
    if(!form.name.trim())        e.name="사번 조회를 해주세요.";
    if(!form.userEmpId.trim())   e.userEmpId="이용자 사번을 입력해주세요.";
    if(!form.userEmpName.trim()) e.userEmpName="사번 조회를 해주세요.";
    if(!form.date)               e.date="날짜를 선택해주세요.";
    if(!form.time)               e.time="시간을 선택해주세요.";
    if(!form.course)             e.course="골프장을 선택해주세요.";
    if(form.pw.length<4)         e.pw="비밀번호 4자리 이상 입력해주세요.";
    if(form.pw!==form.pwConfirm) e.pwConfirm="비밀번호가 일치하지 않습니다.";
    return e;
  };

  const handleSubmit = async () => {
    const e=validate();
    if(Object.keys(e).length>0){setErrors(e);return;}
    setSaving(true);
    try {
      const params = new URLSearchParams({
        action:"insert", name:form.name, dept:form.dept, date:form.date,
        time:form.time, course:form.course, note:form.note||"", pw:form.pw,
        empId:form.empId, empName:form.name,
        userEmpId:form.userEmpId, userEmpName:form.userEmpName, userDept:form.userDept
      });
      const res = await fetch(`${API_URL}?${params}`);
      const data = await res.json();
      if(data.success){
        setReservations(prev=>[{id:data.id,...form,status:"pending"},...prev]);
        setPage("success");
      }
    } catch(e){ console.error(e); }
    setSaving(false);
  };

  const handleLookup = () => {
    if(!lookupName.trim()){setLookupError("먼저 사번 조회를 해주세요.");return;}
    if(!lookupPw.trim()){setLookupError("비밀번호를 입력해주세요.");return;}
    const found=reservations.filter(r=>
      String(r.name).replace(/^'/,"")===lookupName.trim()&&
      String(r.pw).replace(/^'/,"")===lookupPw.trim()
    );
    if(found.length===0){setLookupError("일치하는 예약 정보가 없습니다.");return;}
    setMyRes(found); setPage("myReservation");
  };

  const changeStatus = async (id, status) => {
    try {
      const params = new URLSearchParams({action:"updateStatus",id,status});
      await fetch(`${API_URL}?${params}`);
      // 기존 데이터를 유지하면서 status만 변경
      setReservations(prev=>prev.map(r=>r.id===id?{...r,status}:r));
      // 구글시트에서 최신 데이터 다시 불러오기
      const res = await fetch(`${API_URL}?action=getAll`);
      const data = await res.json();
      if(Array.isArray(data)) setReservations(data);
    } catch(e){ console.error(e); }
  };

  const getAdminAlerts = () => {
    const today=new Date(), year=today.getFullYear(), month=today.getMonth()+1, day=today.getDate(), dow=today.getDay();
    const alerts=[];
    if(day>=5&&day<=10) alerts.push({type:"신청기간",course:"코리아",color:COURSE_COLORS["코리아"],bg:COURSE_BG["코리아"],msg:`코리아CC 예약 신청 기간입니다! (매월 5~10일, 오늘: ${month}월 ${day}일)`,url:COURSE_URLS["코리아"]});
    if(day===20) alerts.push({type:"확정일",course:"코리아",color:"#b87d00",bg:"#fff8e1",msg:`오늘은 코리아CC 예약 확정일입니다! (전월 20일) 사이트에서 확정 여부를 확인하세요.`,url:COURSE_URLS["코리아"]});
    reservations.filter(r=>String(r.status).replace(/^'/,"")!=="cancelled").forEach(r=>{
      const course=String(r.course||"").replace(/^'/,"");
      if(course!=="크리스탈밸리"&&course!=="설해원") return;
      const dateStr=String(r.date||"").replace(/^'/,"").substring(0,10);
      if(!dateStr||dateStr.length<10) return;
      const resDate=new Date(dateStr),resYear=resDate.getFullYear(),resMonth=resDate.getMonth()+1;
      const userName=String(r.userEmpName||r.name||"").replace(/^'/,"");
      const siteUrl=COURSE_URLS[course];
      let am=resMonth-2,ay=resYear; if(am<=0){am+=12;ay-=1;}
      if(year===ay&&month===am&&day>=25&&day<=28) alerts.push({type:"신청기간",course,color:COURSE_COLORS[course],bg:COURSE_BG[course],msg:`${course} 예약 신청 기간입니다!\n이용자: ${userName} / 예약일: ${dateStr}`,url:siteUrl});
      let cm=resMonth-1,cy=resYear; if(cm<=0){cm+=12;cy-=1;}
      if(year===cy&&month===cm){
        if(course==="크리스탈밸리"&&day>=8&&day<=14&&dow===2) alerts.push({type:"확정일",course,color:"#b87d00",bg:"#fff8e1",msg:`크리스탈밸리 예약 확정일!\n이용자: ${userName} / 예약일: ${dateStr}`,url:siteUrl});
        if(course==="설해원"&&day>=1&&day<=7) alerts.push({type:"확정일",course,color:"#b87d00",bg:"#fff8e1",msg:`설해원 예약 확정 기간!\n이용자: ${userName} / 예약일: ${dateStr}`,url:siteUrl});
      }
    });
    return alerts;
  };

  const filtered=(filterStatus==="all"?reservations:reservations.filter(r=>r.status===filterStatus))
    .filter(r=>!calSel||String(r.date||"").replace(/^'/,"").substring(0,10)===calSel);

  if(loading) return (
    <div style={{minHeight:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
      <div style={{fontSize:36}}>⛳</div>
      <p style={{color:"#4a6741",fontSize:15}}>데이터를 불러오는 중...</p>
    </div>
  );

  // HOME
  if(page==="home"){
    const today=new Date(), month=today.getMonth()+1, day=today.getDate();
    let korDday="";
    if(day<5) korDday=`D-${5-day}`;
    else if(day<=10) korDday="접수중!";
    else{ const dim=new Date(today.getFullYear(),month,0).getDate(); korDday=`D-${dim-day+5}`; }
    let crystalDday="";
    if(day<25) crystalDday=`D-${25-day}`;
    else if(day<=28) crystalDday="접수중!";
    else{ const dim2=new Date(today.getFullYear(),month,0).getDate(); crystalDday=`D-${dim2-day+25}`; }
    return (
      <div style={{minHeight:480,background:"linear-gradient(160deg,#e8f5e0 0%,#f0f7eb 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}}>
        <div style={{fontSize:48,marginBottom:8}}>⛳</div>
        <h1 style={{fontSize:26,fontWeight:700,color:"#1a4a1a",margin:"0 0 6px"}}>SK스퀘어 골프예약 신청</h1>
        <p style={{color:"#4a6741",fontSize:15,margin:"0 0 16px",textAlign:"center"}}>임원(비서)전용 예약신청 페이지입니다.</p>
        <div style={{background:"#fff",border:"1px solid #c8e0be",borderRadius:14,padding:"14px 20px",marginBottom:24,width:"100%",maxWidth:380,boxSizing:"border-box"}}>
          <p style={{fontSize:12,fontWeight:700,color:"#1a4a1a",margin:"0 0 10px",textAlign:"center"}}>📅 골프장 접수 일정</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["코리아","코리아CC","매월 5~10일 (D-1개월)",korDday],["크리스탈밸리","크리스탈밸리","매월 25~28일 (D-2개월)",crystalDday],["설해원","설해원","매월 25~28일 (D-2개월)",crystalDday]].map(([key,name,desc,dday])=>(
              <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:COURSE_BG[key],borderRadius:9,padding:"8px 12px"}}>
                <div>
                  <span style={{fontSize:12,fontWeight:700,color:COURSE_COLORS[key]}}>{name}</span>
                  <span style={{fontSize:11,color:"#4a6741",marginLeft:6}}>{desc}</span>
                </div>
                <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,
                  background:dday==="접수중!"?COURSE_COLORS[key]:"transparent",
                  color:dday==="접수중!"?"#fff":COURSE_COLORS[key],
                  border:`1px solid ${COURSE_COLORS[key]}`}}>
                  {dday}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={()=>setPage("form")} style={{padding:"12px 28px",background:"#2e6b2e",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:600,cursor:"pointer"}}>예약 신청하기</button>
          <button onClick={()=>setPage("lookup")} style={{padding:"12px 24px",background:"#fff",color:"#2e6b2e",border:"1.5px solid #2e6b2e",borderRadius:10,fontSize:15,fontWeight:500,cursor:"pointer"}}>내 예약 확인</button>
          <button onClick={()=>setPage("adminLogin")} style={{padding:"12px 20px",background:"#fff",color:"#555",border:"1px solid #c8d8c0",borderRadius:10,fontSize:14,cursor:"pointer"}}>담당자 로그인</button>
        </div>
      </div>
    );
  }

  // FORM
  if(page==="form") return (
    <div style={{padding:"1.5rem 1rem",maxWidth:700,margin:"0 auto"}}>
      <button onClick={()=>setPage("home")} style={{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:14,padding:0,marginBottom:16}}>← 홈으로</button>
      <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:260,background:"#f3f9ef",borderRadius:12,padding:"1.4rem",border:"1px solid #c8e0be"}}>
          <h2 style={{fontSize:18,fontWeight:700,color:"#1a4a1a",margin:"0 0 1rem"}}>⛳ 예약 신청</h2>
          {/* 신청자 */}
          <div style={{background:"#eaf4e4",border:"1px solid #b8d8a8",borderRadius:9,padding:"12px",marginBottom:12}}>
            <p style={{fontSize:12,fontWeight:700,color:"#2e6b2e",margin:"0 0 8px"}}>👤 신청자 (비서)</p>
            <label style={labelStyle}>사번</label>
            <input type="text" placeholder="사번 입력 시 자동 조회" value={form.empId}
              onChange={e=>setF("empId",e.target.value)} style={inputStyle(errors.empId)}/>
            {errors.empId&&<p style={errStyle}>{errors.empId}</p>}
            {empLoading&&<p style={{fontSize:11,color:"#6a8e61",margin:"4px 0 0"}}>조회 중...</p>}
            {form.name&&<div style={{display:"flex",gap:10,background:"#fff",borderRadius:7,padding:"8px 10px",border:"1px solid #c8e0be",fontSize:13,marginTop:6}}>
              <span style={{color:"#4a6741"}}>이름: <strong>{form.name}</strong></span>
              <span style={{color:"#4a6741"}}>부서: <strong>{form.dept}</strong></span>
            </div>}
            {errors.name&&<p style={errStyle}>{errors.name}</p>}
          </div>
          {/* 이용자 */}
          <div style={{background:"#e8eefa",border:"1px solid #b8c8f0",borderRadius:9,padding:"12px",marginBottom:12}}>
            <p style={{fontSize:12,fontWeight:700,color:"#1a3a6e",margin:"0 0 8px"}}>👑 이용자 (임원)</p>
            <label style={labelStyle}>사번</label>
            <input type="text" placeholder="사번 입력 시 자동 조회" value={form.userEmpId}
              onChange={e=>setF("userEmpId",e.target.value)} style={inputStyle(errors.userEmpId)}/>
            {errors.userEmpId&&<p style={errStyle}>{errors.userEmpId}</p>}
            {userEmpLoading&&<p style={{fontSize:11,color:"#6a8e61",margin:"4px 0 0"}}>조회 중...</p>}
            {form.userEmpName&&<div style={{display:"flex",gap:10,background:"#fff",borderRadius:7,padding:"8px 10px",border:"1px solid #b8c8f0",fontSize:13,marginTop:6}}>
              <span style={{color:"#1a3a6e"}}>이름: <strong>{form.userEmpName}</strong></span>
              <span style={{color:"#1a3a6e"}}>부서: <strong>{form.userDept}</strong></span>
            </div>}
            {errors.userEmpName&&<p style={errStyle}>{errors.userEmpName}</p>}
          </div>
          {/* 날짜/시간 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div>
              <label style={labelStyle}>날짜</label>
              <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                onChange={e=>{const d=e.target.value;setF("date",d);checkDateConflict(d);}} style={inputStyle(errors.date)}/>
              {errors.date&&<p style={errStyle}>{errors.date}</p>}
            </div>
            <div>
              <label style={labelStyle}>티오프 시간</label>
              <select value={form.time} onChange={e=>setF("time",e.target.value)} style={inputStyle(errors.time)}>
                <option value="">선택</option>
                {timeSlots.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              {errors.time&&<p style={errStyle}>{errors.time}</p>}
            </div>
          </div>
          {/* 골프장 */}
          <div style={{marginBottom:12}}>
            <label style={labelStyle}>골프장 선택</label>
            <div style={{display:"flex",gap:8}}>
              {COURSES.map(c=>(
                <button key={c} onClick={()=>{setF("course",c);setCourseNotice(COURSE_NOTICES[c]);}}
                  style={{flex:1,padding:"9px 6px",borderRadius:8,border:form.course===c?`2px solid ${COURSE_COLORS[c]}`:"1px solid #c8d8c0",
                    background:form.course===c?COURSE_BG[c]:"#fff",color:form.course===c?COURSE_COLORS[c]:"#4a6741",
                    fontWeight:form.course===c?700:400,fontSize:13,cursor:"pointer"}}>
                  {c}
                </button>
              ))}
            </div>
            {errors.course&&<p style={errStyle}>{errors.course}</p>}
          </div>
          <div style={{marginBottom:12}}>
            <label style={labelStyle}>요청사항 (선택)</label>
            <textarea placeholder="기타 문의사항 등" value={form.note} onChange={e=>setF("note",e.target.value)} rows={2} style={{...inputStyle(false),resize:"vertical"}}/>
          </div>
          <div style={{background:"#eaf4e4",border:"1px solid #b8d8a8",borderRadius:9,padding:"12px",marginBottom:14}}>
            <p style={{fontSize:12,color:"#3a6e2a",margin:"0 0 10px",fontWeight:500}}>🔒 예약 조회용 비밀번호를 설정해주세요.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={labelStyle}>비밀번호</label>
                <input type="password" placeholder="4자리 이상" value={form.pw} onChange={e=>setF("pw",e.target.value)} style={inputStyle(errors.pw)}/>
                {errors.pw&&<p style={errStyle}>{errors.pw}</p>}
              </div>
              <div>
                <label style={labelStyle}>비밀번호 확인</label>
                <input type="password" placeholder="동일하게 입력" value={form.pwConfirm} onChange={e=>setF("pwConfirm",e.target.value)} style={inputStyle(errors.pwConfirm)}/>
                {errors.pwConfirm&&<p style={errStyle}>{errors.pwConfirm}</p>}
              </div>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={saving} style={{...btnPrimary,opacity:saving?0.7:1}}>
            {saving?"저장 중...":"예약 신청 완료"}
          </button>
        </div>
        {/* 달력 + 안내 */}
        <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:200,maxWidth:220}}>
          <MiniCalendar reservations={reservations} selectedDate={form.date} onSelect={d=>{setF("date",d);checkDateConflict(d);}}/>
          <div style={{background:"#fff8e1",border:"1px solid #ffe082",borderRadius:12,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#b87d00",margin:"0 0 6px"}}>⚠️ 예약 주의사항</p>
            <p style={{fontSize:11,color:"#7a5c00",lineHeight:1.65,margin:0}}>
              예약 취소는 이용일 <strong>최소 10일 전</strong>까지 담당자에게 연락 바랍니다.<br/>
              <span style={{color:"#c0392b"}}>(법인명의로 패널티 부여되므로 꼭 연락주시기 바랍니다.)</span>
            </p>
          </div>
          <div style={{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:12,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#1a4a1a",margin:"0 0 8px"}}>⛳ 골프장별 예약 확정일<br/><span style={{fontSize:10,fontWeight:400,color:"#6a8e61"}}>(이용일 기준)</span></p>
            {(()=>{
              const today=new Date(), nm=(today.getMonth()+2)>12?1:today.getMonth()+2;
              const ny=(today.getMonth()+2)>12?today.getFullYear()+1:today.getFullYear();
              const cm=nm-1<=0?12:nm-1, cy=nm-1<=0?ny-1:ny;
              let tue=8; for(let d=8;d<=14;d++){ if(new Date(cy,cm-1,d).getDay()===2){tue=d;break;} }
              return [
                ["코리아CC","#1a5c2e","#e8f5e0","전월 20일 확정",`ex) ${nm}/27 이용일, ${cm}/20 확정`],
                ["크리스탈밸리","#1a3a6e","#e3ecfa","전월 2주차 화요일 확정",`ex) ${nm}/27 이용일, ${cm}/${tue} 확정`],
                ["설해원","#8b1a1a","#faeaea","전월 1주차 내 확정",`ex) ${nm}/27 이용일, ${cm}/7 확정`],
              ].map(([name,color,bg,desc,ex])=>(
                <div key={name} style={{display:"flex",flexDirection:"column",background:bg,borderRadius:8,padding:"6px 9px",marginBottom:5}}>
                  <span style={{fontSize:11,fontWeight:700,color}}>{name}</span>
                  <span style={{fontSize:11,color:"#444",marginTop:1}}>{desc}</span>
                  <span style={{fontSize:10,color:"#888",marginTop:2}}>{ex}</span>
                </div>
              ));
            })()}
          </div>
          <div style={{background:"#f0f4ff",border:"1px solid #c5cff5",borderRadius:12,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#1a2e6e",margin:"0 0 6px"}}>📞 문의처 / 담당자</p>
            <p style={{fontSize:11,color:"#2a3a6e",lineHeight:1.7,margin:0}}>
              HR <strong>홍미소</strong><br/>
              <a href="mailto:miso.hong@sk.com" style={{color:"#1a3a6e",textDecoration:"none"}}>miso.hong@sk.com</a><br/>
              <a href="tel:010-2101-6313" style={{color:"#1a3a6e",textDecoration:"none",fontWeight:600}}>010-2101-6313</a>
            </p>
          </div>
        </div>
      </div>
      {/* 날짜 중복 팝업 */}
      {dateConflict&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setDateConflict(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,padding:"2rem 1.8rem",maxWidth:300,width:"90%",boxSizing:"border-box",border:"1px solid #ffe082",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10}}>⚠️</div>
            <h3 style={{fontSize:15,fontWeight:700,color:"#b87d00",margin:"0 0 10px"}}>동일 날짜 신청 안내</h3>
            <p style={{fontSize:14,color:"#7a5c00",lineHeight:1.75,margin:"0 0 20px",background:"#fff8e1",borderRadius:9,padding:"12px 14px",border:"1px solid #ffe082"}}>
              동일한 날짜에 <strong>{dateConflict}명</strong>의 신청건이 있습니다.
            </p>
            <button onClick={()=>setDateConflict(null)} style={{...btnPrimary,width:"auto",padding:"10px 28px",background:"#e6a817"}}>확인</button>
          </div>
        </div>
      )}
      {/* 골프장 팝업 */}
      {courseNotice&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setCourseNotice(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,padding:"2rem 1.8rem",maxWidth:320,width:"90%",boxSizing:"border-box",border:"1px solid #c8e0be",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10}}>📋</div>
            <h3 style={{fontSize:16,fontWeight:700,color:"#1a4a1a",margin:"0 0 10px"}}>{courseNotice.title}</h3>
            <p style={{fontSize:14,color:"#4a6741",lineHeight:1.75,margin:"0 0 20px",background:"#f3f9ef",borderRadius:9,padding:"12px 14px",border:"1px solid #c8e0be"}}>{courseNotice.msg}</p>
            <button onClick={()=>setCourseNotice(null)} style={{...btnPrimary,width:"auto",padding:"10px 32px"}}>확인</button>
          </div>
        </div>
      )}
    </div>
  );

  // SUCCESS
  if(page==="success") return (
    <div style={{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}}>
      <div style={{maxWidth:380,textAlign:"center",background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:16,padding:"2.5rem 2rem"}}>
        <div style={{fontSize:50,marginBottom:10}}>✅</div>
        <h2 style={{fontSize:21,fontWeight:700,color:"#1a4a1a",margin:"0 0 10px"}}>예약 신청이 완료되었습니다!</h2>
        <p style={{color:"#4a6741",fontSize:14,lineHeight:1.7,margin:"0 0 18px"}}>담당자 확인 후 순차적으로 안내 드리겠습니다.</p>
        <div style={{background:"#fff",border:"1px solid #c8e0be",borderRadius:10,padding:"1rem",textAlign:"left",marginBottom:16,fontSize:14}}>
          {[["신청자",form.name],["신청자 부서",form.dept],["이용자",form.userEmpName],["이용자 부서",form.userDept],["골프장",form.course],["날짜",form.date],["시간",form.time]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:"#4a6741"}}>{k}</span>
              <strong style={{color:k==="골프장"?COURSE_COLORS[v]:"#1a4a1a"}}>{v}</strong>
            </div>
          ))}
        </div>
        <div style={{background:"#eaf4e4",border:"1px solid #b8d8a8",borderRadius:9,padding:"10px 14px",marginBottom:20,fontSize:13,color:"#3a6e2a",textAlign:"left"}}>
          🔒 설정한 비밀번호로 <strong>내 예약 확인</strong>에서 조회하실 수 있습니다.
        </div>
        <button onClick={()=>{setPage("home");setForm({empId:"",name:"",dept:"",userEmpId:"",userEmpName:"",userDept:"",date:"",time:"",course:"",note:"",pw:"",pwConfirm:""});setErrors({});}}
          style={{...btnPrimary,width:"auto",padding:"11px 28px"}}>홈으로 돌아가기</button>
      </div>
    </div>
  );

  // LOOKUP
  if(page==="lookup") return (
    <div style={{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}}>
      <div style={{width:320,background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:14,padding:"2rem"}}>
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:13,padding:0,marginBottom:14}}>← 홈으로</button>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:32}}>🔍</div>
          <h2 style={{fontSize:17,fontWeight:700,color:"#1a4a1a",margin:"8px 0 0"}}>내 예약 확인</h2>
          <p style={{fontSize:12,color:"#6a8e61",margin:"6px 0 0"}}>사번 입력 시 자동 조회됩니다.</p>
        </div>
        <div style={{marginBottom:8}}>
          <label style={labelStyle}>사번</label>
          <input type="text" placeholder="사번 입력" value={lookupEmpId}
            onChange={e=>{setLookupEmpId(e.target.value);setLookupError("");}}
            style={inputStyle(false)}/>
        </div>
        {lookupEmpLoading&&<p style={{fontSize:11,color:"#6a8e61",margin:"4px 0 6px"}}>조회 중...</p>}
        {lookupName&&(
          <div style={{display:"flex",gap:10,background:"#f3f9ef",borderRadius:7,padding:"8px 10px",border:"1px solid #c8e0be",fontSize:13,marginBottom:10}}>
            <span style={{color:"#4a6741"}}>이름: <strong>{lookupName}</strong></span>
            <span style={{color:"#4a6741"}}>부서: <strong>{lookupDept}</strong></span>
          </div>
        )}
        <div style={{marginBottom:14}}>
          <label style={labelStyle}>비밀번호</label>
          <input type="password" placeholder="설정한 비밀번호" value={lookupPw}
            onChange={e=>{setLookupPw(e.target.value);setLookupError("");}}
            onKeyDown={e=>{if(e.key==="Enter")handleLookup();}}
            style={inputStyle(!!lookupError)}/>
        </div>
        {lookupError&&<p style={{...errStyle,marginBottom:8,fontSize:13}}>{lookupError}</p>}
        <button onClick={handleLookup} style={btnPrimary}>예약 조회</button>
      </div>
    </div>
  );

  // MY RESERVATION
  if(page==="myReservation") return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"1.5rem 1rem"}}>
      <button onClick={()=>{setPage("home");setLookupEmpId("");setLookupName("");setLookupDept("");setLookupPw("");setMyRes(null);setLookupError("");}}
        style={{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:14,padding:0,marginBottom:16}}>← 홈으로</button>
      <div style={{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:12,padding:"1.2rem",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"#d4ead4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#2e6b2e"}}>
            {lookupName.slice(0,1)}
          </div>
          <div>
            <p style={{margin:0,fontWeight:700,fontSize:16,color:"#1a4a1a"}}>{lookupName}</p>
            <p style={{margin:0,fontSize:13,color:"#6a8e61"}}>{lookupDept}</p>
          </div>
        </div>
      </div>
      <p style={{fontSize:13,color:"#4a6741",margin:"0 0 12px"}}>총 <strong>{myRes.length}건</strong>의 예약 내역입니다.</p>

      {/* 테이블 */}
      <div style={{background:"#fff",border:"1px solid #c8e0be",borderRadius:12,overflow:"hidden"}}>
        {/* 헤더 */}
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr 0.8fr 1.2fr",background:"#2e6b2e",padding:"10px 14px",gap:8}}>
          {["이용자","골프장","이용일","시간","진행상태"].map(h=>(
            <div key={h} style={{fontSize:12,fontWeight:700,color:"#fff",textAlign:"center"}}>{h}</div>
          ))}
        </div>
        {/* 행 */}
        {myRes.map((r,i)=>(
          <div key={r.id} style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr 0.8fr 1.2fr",padding:"12px 14px",gap:8,
            borderTop:i===0?"none":"1px solid #e8f0e4",
            background:r.status==="confirmed"?"#f3fdf5":r.status==="cancelled"?"#fff8f8":"#fff",
            boxShadow:r.status==="confirmed"?"inset 3px 0 0 #1a6e3a":r.status==="cancelled"?"inset 3px 0 0 #e53935":"inset 3px 0 0 transparent"}}>
            {/* 이용자 */}
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#1a3a6e"}}>{r.userEmpName||"-"}</div>
              <div style={{fontSize:11,color:"#9ab890"}}>{r.userDept||""}</div>
            </div>
            {/* 골프장 */}
            <div style={{textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:12,fontWeight:600,padding:"2px 10px",borderRadius:10,background:COURSE_BG[r.course],color:COURSE_COLORS[r.course]}}>{r.course}</span>
            </div>
            {/* 이용일 */}
            <div style={{textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:12,color:"#1a4a1a"}}>{String(r.date||"").replace(/^'/,"").substring(0,10)}</span>
            </div>
            {/* 시간 */}
            <div style={{textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:12,color:"#1a4a1a"}}>{r.time}</span>
            </div>
            {/* 진행상태 */}
            <div style={{textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,
                background:STATUS[r.status]?.bg||"#eee",color:STATUS[r.status]?.color||"#333",
                border:`1.5px solid ${STATUS[r.status]?.color||"#ccc"}`,
                boxShadow:r.status==="confirmed"?"0 0 6px rgba(26,110,58,0.25)":"none"}}>
                {r.status==="confirmed"?"✅ 확정":r.status==="cancelled"?"❌ 취소":"⏳ 대기중"}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* 요청사항 있는 경우 별도 표시 */}
      {myRes.some(r=>r.note) && (
        <div style={{marginTop:12}}>
          {myRes.filter(r=>r.note).map(r=>(
            <div key={r.id} style={{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:8,padding:"8px 12px",marginBottom:6,fontSize:12,color:"#4a6741"}}>
              <strong>{String(r.date||"").replace(/^'/,"").substring(0,10)} {r.course}</strong> — 📝 {r.note}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ADMIN LOGIN
  if(page==="adminLogin") return (
    <div style={{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}}>
      <div style={{width:300,background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:14,padding:"2rem"}}>
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:13,padding:0,marginBottom:14}}>← 홈으로</button>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:30}}>🔐</div>
          <h2 style={{fontSize:17,fontWeight:700,color:"#1a4a1a",margin:"8px 0 0"}}>담당자 로그인</h2>
        </div>
        <label style={labelStyle}>비밀번호</label>
        <input type="password" placeholder="비밀번호 입력" value={adminPw}
          onChange={e=>{setAdminPw(e.target.value);setAdminError("");}}
          onKeyDown={e=>{if(e.key==="Enter"){if(adminPw===ADMIN_PASSWORD)setPage("admin");else setAdminError("비밀번호가 올바르지 않습니다.");}}}
          style={inputStyle(!!adminError)}/>
        {adminError&&<p style={errStyle}>{adminError}</p>}
        <button onClick={()=>{if(adminPw===ADMIN_PASSWORD)setPage("admin");else setAdminError("비밀번호가 올바르지 않습니다.");}}
          style={{...btnPrimary,marginTop:12}}>로그인</button>
      </div>
    </div>
  );

  // ADMIN
  const adminAlerts=getAdminAlerts();
  return (
    <div style={{padding:"1.2rem 1rem",maxWidth:780,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <h2 style={{fontSize:19,fontWeight:700,color:"#1a4a1a",margin:0}}>⛳ 예약 관리</h2>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {COURSES.map(c=>(
            <a key={c} href={COURSE_URLS[c]} target="_blank" rel="noreferrer"
              style={{padding:"7px 12px",background:COURSE_BG[c],color:COURSE_COLORS[c],border:`1px solid ${COURSE_COLORS[c]}40`,borderRadius:8,fontSize:12,fontWeight:600,textDecoration:"none"}}>
              {c} 🔗
            </a>
          ))}
          <button onClick={()=>{
            const header=["ID","이름","부서","날짜","시간","골프장","요청사항","상태","신청일","신청자사번","신청자","이용자사번","이용자","이용자부서"];
            const rows=reservations.map(r=>[r.id,r.name,r.dept,r.date,r.time,r.course,r.note||"",STATUS[r.status]?.label||r.status,r.created_at||"",r.empId||"",r.empName||"",r.userEmpId||"",r.userEmpName||"",r.userDept||""]);
            const csv=[header,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
            const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
            const url=URL.createObjectURL(blob);
            const a=document.createElement("a");
            a.href=url;a.download="골프예약목록.csv";a.click();
            URL.revokeObjectURL(url);
          }} style={{padding:"7px 14px",background:"#e8f5e9",color:"#1a6e3a",border:"1px solid #a5d6a7",borderRadius:8,fontSize:13,cursor:"pointer",fontWeight:500}}>
            📥 엑셀 다운로드
          </button>
          <button onClick={()=>{setPage("home");setAdminPw("");}} style={{padding:"7px 14px",background:"none",border:"1px solid #c8e0be",borderRadius:8,color:"#4a6741",fontSize:13,cursor:"pointer"}}>로그아웃</button>
        </div>
      </div>
      {/* 알림 배너 */}
      <div style={{marginBottom:16}}>
        {adminAlerts.length===0?(
          <div style={{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#4a6741"}}>
            ✅ 오늘은 신청기간 및 확정일 알림이 없습니다.
          </div>
        ):adminAlerts.map((a,i)=>(
          <div key={i} style={{background:a.bg,border:`1px solid ${a.color}40`,borderLeft:`4px solid ${a.color}`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:8}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10,background:a.color,color:"#fff"}}>{a.type==="신청기간"?"📝 신청기간":"✅ 확정일"}</span>
                <span style={{fontSize:12,fontWeight:700,color:a.color}}>{a.course}</span>
              </div>
              <p style={{fontSize:12,color:"#333",margin:0,lineHeight:1.6,whiteSpace:"pre-line"}}>{a.msg}</p>
            </div>
            <a href={a.url} target="_blank" rel="noreferrer"
              style={{flexShrink:0,padding:"6px 12px",background:a.color,color:"#fff",borderRadius:7,fontSize:12,fontWeight:600,textDecoration:"none"}}>
              사이트 이동 🔗
            </a>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:280}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
            {[["전체",reservations.length,"#1a4a1a"],["대기중",reservations.filter(r=>r.status==="pending").length,"#b87d00"],["확정",reservations.filter(r=>r.status==="confirmed").length,"#1a6e3a"]].map(([l,c,col])=>(
              <div key={l} style={{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:10,padding:"10px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:700,color:col}}>{c}</div>
                <div style={{fontSize:11,color:"#6a8e61",marginTop:1}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
            {[["all","전체"],["pending","대기중"],["confirmed","확정"],["cancelled","취소"]].map(([v,l])=>(
              <button key={v} onClick={()=>setFilterStatus(v)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filterStatus===v?"#2e6b2e":"#c8e0be"}`,background:filterStatus===v?"#2e6b2e":"#fff",color:filterStatus===v?"#fff":"#4a6741",fontSize:12,cursor:"pointer"}}>{l}</button>
            ))}
            {calSel&&<button onClick={()=>setCalSel("")} style={{padding:"5px 12px",borderRadius:20,border:"1px solid #e8b0b0",background:"#fff5f5",color:"#b71c1c",fontSize:12,cursor:"pointer"}}>{calSel} ✕</button>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.length===0&&<p style={{color:"#9ab890",textAlign:"center",padding:"1.5rem",fontSize:14}}>예약 내역이 없습니다.</p>}
            {filtered.map(r=>(
              <div key={r.id} style={{background:"#fff",border:"1px solid #c8e0be",borderRadius:11,padding:"0.9rem 1.1rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:COURSE_BG[r.course],color:COURSE_COLORS[r.course],fontWeight:600}}>{r.course}</span>
                  <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,background:STATUS[r.status]?.bg||"#eee",color:STATUS[r.status]?.color||"#333"}}>{STATUS[r.status]?.label||r.status}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:8,marginBottom:6}}>
                  <div style={{background:"#eaf4e4",borderRadius:7,padding:"6px 10px",fontSize:12}}>
                    <div style={{color:"#2e6b2e",fontWeight:600,marginBottom:2}}>👤 신청자</div>
                    <div style={{color:"#1a4a1a"}}>{r.empName||r.name}</div>
                    <div style={{color:"#6a8e61",fontSize:11}}>{r.dept}</div>
                  </div>
                  <div style={{background:"#e8eefa",borderRadius:7,padding:"6px 10px",fontSize:12}}>
                    <div style={{color:"#1a3a6e",fontWeight:600,marginBottom:2}}>👑 이용자</div>
                    <div style={{color:"#1a3a6e"}}>{r.userEmpName||"-"}</div>
                    <div style={{color:"#6a8e61",fontSize:11}}>{r.userDept||"-"}</div>
                  </div>
                </div>
                <div style={{fontSize:13,color:"#4a6741",display:"flex",gap:12,flexWrap:"wrap"}}>
                  <span>📅 {r.date}</span><span>🕐 {r.time}</span>
                </div>
                {r.note&&<div style={{marginTop:5,fontSize:12,color:"#7a9e71",background:"#f3f9ef",borderRadius:6,padding:"5px 9px"}}>📝 {r.note}</div>}
                <div style={{marginTop:10,display:"flex",gap:6}}>
                  {r.status!=="confirmed"&&<button onClick={()=>changeStatus(r.id,"confirmed")} style={{padding:"5px 12px",background:"#e8f5e9",color:"#1a6e3a",border:"1px solid #a5d6a7",borderRadius:7,fontSize:12,cursor:"pointer"}}>확정</button>}
                  {r.status!=="pending"&&r.status!=="cancelled"&&<button onClick={()=>changeStatus(r.id,"pending")} style={{padding:"5px 12px",background:"#fff8e1",color:"#b87d00",border:"1px solid #ffe082",borderRadius:7,fontSize:12,cursor:"pointer"}}>대기중</button>}
                  {r.status!=="cancelled"&&<button onClick={()=>changeStatus(r.id,"cancelled")} style={{padding:"5px 12px",background:"#ffebee",color:"#b71c1c",border:"1px solid #ffcdd2",borderRadius:7,fontSize:12,cursor:"pointer"}}>취소</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <MiniCalendar reservations={reservations} selectedDate={calSel} onSelect={d=>setCalSel(prev=>prev===d?"":d)}/>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
