// ⚠️ Apps Script URL (이미 연결됨)
const API_URL = "https://script.google.com/macros/s/AKfycbySjCPtVMkwSQPxHlKmxNLQ7cnkb1EVhjaitXMwywTDq4i3hUFvzyj-47AkDIDZIqBW/exec";
const ADMIN_PASSWORD = "golf1234"; // 원하시면 변경하세요
const COURSES = ["코리아", "아메리카", "재팬"];
const COURSE_COLORS = { "코리아": "#1a5c2e", "아메리카": "#1a3a6e", "재팬": "#8b1a1a" };
const COURSE_BG    = { "코리아": "#e8f5e0", "아메리카": "#e3ecfa", "재팬": "#faeaea" };
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
    if(!resMap[r.date]) resMap[r.date]=[];
    resMap[r.date].push(r.course);
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
  const [form, setForm] = React.useState({name:"",dept:"",date:"",time:"",course:"",note:"",pw:"",pwConfirm:""});
  const [errors, setErrors] = React.useState({});
  const [showKoreaNotice, setShowKoreaNotice] = React.useState(false);
  const [lookupName, setLookupName] = React.useState("");
  const [lookupPw,   setLookupPw]   = React.useState("");
  const [lookupError, setLookupError] = React.useState("");
  const [myRes, setMyRes] = React.useState(null);
  const [adminPw, setAdminPw] = React.useState("");
  const [adminError, setAdminError] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [calSel, setCalSel] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}?action=getAll`);
        const data = await res.json();
        if (Array.isArray(data)) setReservations(data);
      } catch(e) {
        console.error("불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setF = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:""})); };

  const validate = () => {
    const e={};
    if(!form.name.trim())  e.name="이름을 입력해주세요.";
    if(!form.dept.trim())  e.dept="부서명을 입력해주세요.";
    if(!form.date)         e.date="날짜를 선택해주세요.";
    if(!form.time)         e.time="시간을 선택해주세요.";
    if(!form.course)       e.course="골프장을 선택해주세요.";
    if(form.pw.length<4)   e.pw="비밀번호 4자리 이상 입력해주세요.";
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
        time:form.time, course:form.course, note:form.note||"", pw:form.pw
      });
      const res = await fetch(`${API_URL}?${params}`);
      const data = await res.json();
      if(data.success) {
        setReservations(prev=>[{id:data.id,...form,status:"pending"},...prev]);
        setPage("success");
      }
    } catch(e) { console.error("저장 실패:",e); }
    setSaving(false);
  };

  const handleLookup = () => {
    if(!lookupName.trim()||!lookupPw.trim()){setLookupError("이름과 비밀번호를 입력해주세요.");return;}
    const found=reservations.filter(r=>r.name===lookupName.trim()&&r.pw===lookupPw.trim());
    if(found.length===0){setLookupError("일치하는 예약 정보가 없습니다.");return;}
    setMyRes(found); setPage("myReservation");
  };

  const changeStatus = async (id, status) => {
    try {
      const params = new URLSearchParams({ action:"updateStatus", id, status });
      await fetch(`${API_URL}?${params}`);
      setReservations(prev=>prev.map(r=>r.id===id?{...r,status}:r));
    } catch(e) { console.error("상태 변경 실패:",e); }
  };

  const filtered=(filterStatus==="all"?reservations:reservations.filter(r=>r.status===filterStatus))
    .filter(r=>!calSel||r.date===calSel);

  if(loading) return (
    <div style={{minHeight:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
      <div style={{fontSize:36}}>⛳</div>
      <p style={{color:"#4a6741",fontSize:15}}>데이터를 불러오는 중...</p>
    </div>
  );

  if(page==="home") return (
    <div style={{minHeight:480,background:"linear-gradient(160deg,#e8f5e0 0%,#f0f7eb 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}}>
      <div style={{fontSize:48,marginBottom:8}}>⛳</div>
      <h1 style={{fontSize:26,fontWeight:700,color:"#1a4a1a",margin:"0 0 6px"}}>그린밸리 골프클럽</h1>
      <p style={{color:"#4a6741",fontSize:15,margin:"0 0 10px",textAlign:"center"}}>편안하고 즐거운 라운딩을 위한 예약 서비스입니다.</p>
      <div style={{display:"flex",gap:8,marginBottom:28}}>
        {COURSES.map(c=><span key={c} style={{fontSize:12,padding:"3px 12px",borderRadius:20,background:COURSE_BG[c],color:COURSE_COLORS[c],fontWeight:600}}>{c}</span>)}
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>setPage("form")} style={{padding:"12px 28px",background:"#2e6b2e",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:600,cursor:"pointer"}}>예약 신청하기</button>
        <button onClick={()=>setPage("lookup")} style={{padding:"12px 24px",background:"#fff",color:"#2e6b2e",border:"1.5px solid #2e6b2e",borderRadius:10,fontSize:15,fontWeight:500,cursor:"pointer"}}>내 예약 확인</button>
        <button onClick={()=>setPage("adminLogin")} style={{padding:"12px 20px",background:"#fff",color:"#555",border:"1px solid #c8d8c0",borderRadius:10,fontSize:14,cursor:"pointer"}}>담당자 로그인</button>
      </div>
    </div>
  );

  if(page==="form") return (
    <div style={{padding:"1.5rem 1rem",maxWidth:700,margin:"0 auto"}}>
      <button onClick={()=>setPage("home")} style={{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:14,padding:0,marginBottom:16}}>← 홈으로</button>
      <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:260,background:"#f3f9ef",borderRadius:12,padding:"1.4rem",border:"1px solid #c8e0be"}}>
          <h2 style={{fontSize:18,fontWeight:700,color:"#1a4a1a",margin:"0 0 1rem"}}>⛳ 예약 신청</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            {[["name","이름","홍길동"],["dept","부서명","영업팀"]].map(([k,l,ph])=>(
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input type="text" placeholder={ph} value={form[k]} onChange={e=>setF(k,e.target.value)} style={inputStyle(errors[k])}/>
                {errors[k]&&<p style={errStyle}>{errors[k]}</p>}
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div>
              <label style={labelStyle}>날짜</label>
              <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]} onChange={e=>setF("date",e.target.value)} style={inputStyle(errors.date)}/>
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
          <div style={{marginBottom:12}}>
            <label style={labelStyle}>골프장 선택</label>
            <div style={{display:"flex",gap:8}}>
              {COURSES.map(c=>(
                <button key={c} onClick={()=>{setF("course",c);if(c==="코리아")setShowKoreaNotice(true);}}
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

        {/* 달력 + 안내문구 */}
        <div style={{display:"flex",flexDirection:"column",gap:10,minWidth:200,maxWidth:220}}>
          <MiniCalendar reservations={reservations} selectedDate={form.date} onSelect={d=>setF("date",d)}/>
          <div style={{background:"#fff8e1",border:"1px solid #ffe082",borderRadius:12,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#b87d00",margin:"0 0 6px"}}>⚠️ 예약 주의사항</p>
            <p style={{fontSize:11,color:"#7a5c00",lineHeight:1.65,margin:0}}>
              예약 취소는 이용일 <strong>최소 10일 전</strong>까지 담당자에게 연락 바랍니다.<br/>
              <span style={{color:"#c0392b"}}>(법인명의로 패널티 부여)</span>
            </p>
          </div>
          <div style={{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:12,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#1a4a1a",margin:"0 0 8px"}}>⛳ 골프장별 예약 확정일<br/><span style={{fontSize:10,fontWeight:400,color:"#6a8e61"}}>(이용일 기준)</span></p>
            {[
              ["코리아CC","#1a5c2e","#e8f5e0","전월 20일 확정"],
              ["아메리카","#1a3a6e","#e3ecfa","전월 2주차 화요일 확정"],
              ["재팬","#8b1a1a","#faeaea","전월 1주차 내 확정"],
            ].map(([name,color,bg,desc])=>(
              <div key={name} style={{display:"flex",flexDirection:"column",background:bg,borderRadius:8,padding:"6px 9px",marginBottom:5}}>
                <span style={{fontSize:11,fontWeight:700,color}}>{name}</span>
                <span style={{fontSize:11,color:"#444",marginTop:1}}>{desc}</span>
              </div>
            ))}
          </div>
          <div style={{background:"#f0f4ff",border:"1px solid #c5cff5",borderRadius:12,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#1a2e6e",margin:"0 0 6px"}}>📞 문의처 / 담당자</p>
            <p style={{fontSize:11,color:"#2a3a6e",lineHeight:1.7,margin:0}}>
              HR <strong>홍미소</strong><br/>
              <a href="tel:010-1234-4567" style={{color:"#1a3a6e",textDecoration:"none",fontWeight:600}}>010-1234-4567</a>
            </p>
          </div>
        </div>
      </div>

      {showKoreaNotice&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setShowKoreaNotice(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,padding:"2rem 1.8rem",maxWidth:320,width:"90%",boxSizing:"border-box",border:"1px solid #c8e0be",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10}}>📋</div>
            <h3 style={{fontSize:16,fontWeight:700,color:"#1a4a1a",margin:"0 0 10px"}}>코리아CC 예약 안내</h3>
            <p style={{fontSize:14,color:"#4a6741",lineHeight:1.75,margin:"0 0 20px",background:"#f3f9ef",borderRadius:9,padding:"12px 14px",border:"1px solid #c8e0be"}}>
              코리아CC의 경우 예약신청일 <strong style={{color:"#1a5c2e"}}>전월 20일</strong>에<br/>확정 여부 확인 가능합니다.
            </p>
            <button onClick={()=>setShowKoreaNotice(false)} style={{...btnPrimary,width:"auto",padding:"10px 32px"}}>확인</button>
          </div>
        </div>
      )}
    </div>
  );

  if(page==="success") return (
    <div style={{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}}>
      <div style={{maxWidth:380,textAlign:"center",background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:16,padding:"2.5rem 2rem"}}>
        <div style={{fontSize:50,marginBottom:10}}>✅</div>
        <h2 style={{fontSize:21,fontWeight:700,color:"#1a4a1a",margin:"0 0 10px"}}>예약 신청이 완료되었습니다!</h2>
        <p style={{color:"#4a6741",fontSize:14,lineHeight:1.7,margin:"0 0 6px"}}>담당자 확인 후 순차적으로 안내 드리겠습니다.</p>
        <p style={{color:"#6a8e61",fontSize:13,margin:"0 0 18px"}}>예약 확정까지 1~2 영업일이 소요될 수 있습니다.</p>
        <div style={{background:"#fff",border:"1px solid #c8e0be",borderRadius:10,padding:"1rem",textAlign:"left",marginBottom:16,fontSize:14}}>
          {[["이름",form.name],["부서명",form.dept],["골프장",form.course],["날짜",form.date],["시간",form.time]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:"#4a6741"}}>{k}</span>
              <strong style={{color:k==="골프장"?COURSE_COLORS[v]:"#1a4a1a"}}>{v}</strong>
            </div>
          ))}
        </div>
        <div style={{background:"#eaf4e4",border:"1px solid #b8d8a8",borderRadius:9,padding:"10px 14px",marginBottom:20,fontSize:13,color:"#3a6e2a",textAlign:"left"}}>
          🔒 설정한 비밀번호로 <strong>내 예약 확인</strong>에서 조회하실 수 있습니다.
        </div>
        <button onClick={()=>{setPage("home");setForm({name:"",dept:"",date:"",time:"",course:"",note:"",pw:"",pwConfirm:""});setErrors({});}}
          style={{...btnPrimary,width:"auto",padding:"11px 28px"}}>홈으로 돌아가기</button>
      </div>
    </div>
  );

  if(page==="lookup") return (
    <div style={{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}}>
      <div style={{width:320,background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:14,padding:"2rem"}}>
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:13,padding:0,marginBottom:14}}>← 홈으로</button>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:32}}>🔍</div>
          <h2 style={{fontSize:17,fontWeight:700,color:"#1a4a1a",margin:"8px 0 0"}}>내 예약 확인</h2>
          <p style={{fontSize:12,color:"#6a8e61",margin:"6px 0 0"}}>예약 시 입력한 이름과 비밀번호를 입력해주세요.</p>
        </div>
        <div style={{marginBottom:12}}>
          <label style={labelStyle}>이름</label>
          <input type="text" placeholder="홍길동" value={lookupName} onChange={e=>{setLookupName(e.target.value);setLookupError("");}} style={inputStyle(!!lookupError)}/>
        </div>
        <div style={{marginBottom:14}}>
          <label style={labelStyle}>비밀번호</label>
          <input type="password" placeholder="설정한 비밀번호" value={lookupPw} onChange={e=>{setLookupPw(e.target.value);setLookupError("");}} onKeyDown={e=>{if(e.key==="Enter")handleLookup();}} style={inputStyle(!!lookupError)}/>
        </div>
        {lookupError&&<p style={{...errStyle,marginBottom:8,fontSize:13}}>{lookupError}</p>}
        <button onClick={handleLookup} style={btnPrimary}>예약 조회</button>
      </div>
    </div>
  );

  if(page==="myReservation") return (
    <div style={{maxWidth:480,margin:"0 auto",padding:"1.5rem 1rem"}}>
      <button onClick={()=>{setPage("home");setLookupName("");setLookupPw("");setMyRes(null);setLookupError("");}} style={{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:14,padding:0,marginBottom:16}}>← 홈으로</button>
      <div style={{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:12,padding:"1.2rem",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"#d4ead4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#2e6b2e"}}>
            {myRes[0].name.slice(0,1)}
          </div>
          <div>
            <p style={{margin:0,fontWeight:700,fontSize:16,color:"#1a4a1a"}}>{myRes[0].name}</p>
            <p style={{margin:0,fontSize:13,color:"#6a8e61"}}>{myRes[0].dept}</p>
          </div>
        </div>
      </div>
      <p style={{fontSize:13,color:"#4a6741",margin:"0 0 10px"}}>총 <strong>{myRes.length}건</strong>의 예약 내역입니다.</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {myRes.map(r=>(
          <div key={r.id} style={{background:"#fff",border:"1px solid #c8e0be",borderRadius:11,padding:"1rem 1.1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:8}}>
              <span style={{fontSize:12,padding:"2px 10px",borderRadius:10,background:COURSE_BG[r.course],color:COURSE_COLORS[r.course],fontWeight:700}}>{r.course}</span>
              <span style={{fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:20,background:STATUS[r.status].bg,color:STATUS[r.status].color}}>{STATUS[r.status].label}</span>
            </div>
            <div style={{fontSize:14,color:"#4a6741",display:"flex",gap:16}}><span>📅 {r.date}</span><span>🕐 {r.time}</span></div>
            {r.note&&<div style={{marginTop:6,fontSize:12,color:"#7a9e71",background:"#f3f9ef",borderRadius:6,padding:"5px 9px"}}>📝 {r.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );

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
        <button onClick={()=>{if(adminPw===ADMIN_PASSWORD)setPage("admin");else setAdminError("비밀번호가 올바르지 않습니다.");}} style={{...btnPrimary,marginTop:12}}>로그인</button>
        <p style={{textAlign:"center",fontSize:11,color:"#9ab890",marginTop:10}}>힌트: golf1234</p>
      </div>
    </div>
  );

  // ADMIN
  return (
    <div style={{padding:"1.2rem 1rem",maxWidth:760,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <h2 style={{fontSize:19,fontWeight:700,color:"#1a4a1a",margin:0}}>⛳ 예약 관리</h2>
        <button onClick={()=>{setPage("home");setAdminPw("");}} style={{padding:"7px 14px",background:"none",border:"1px solid #c8e0be",borderRadius:8,color:"#4a6741",fontSize:13,cursor:"pointer"}}>로그아웃</button>
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
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:15,color:"#1a4a1a"}}>{r.name}</span>
                    <span style={{fontSize:12,color:"#6a8e61",background:"#f3f9ef",padding:"2px 8px",borderRadius:10}}>{r.dept}</span>
                    <span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:COURSE_BG[r.course],color:COURSE_COLORS[r.course],fontWeight:600}}>{r.course}</span>
                  </div>
                  <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,background:STATUS[r.status].bg,color:STATUS[r.status].color}}>{STATUS[r.status].label}</span>
                </div>
                <div style={{marginTop:6,fontSize:13,color:"#4a6741",display:"flex",gap:12,flexWrap:"wrap"}}>
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
