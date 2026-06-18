const API_URL = "https://script.google.com/macros/s/AKfycbwuQwm7FCqIUf9AkEEwj348Dx7Oif63Z4T4XWtteG22SAL7nqvFpPo_BL7SvaBOEIWK/exec";
const ADMIN_PASSWORD = "golf1234";
const COURSES = ["코리아", "크리스탈밸리", "설해원"];
const COURSE_COLORS = { "코리아": "#1a5c2e", "크리스탈밸리": "#1a3a6e", "설해원": "#8b1a1a" };
const COURSE_BG = { "코리아": "#e8f5e0", "크리스탈밸리": "#e3ecfa", "설해원": "#faeaea" };
const COURSE_URLS = {
  "코리아": "https://www.gakorea.com/index.asp",
  "크리스탈밸리": "https://www.crystalvalley.co.kr/index.asp",
  "설해원": "https://www.seolhaeone.com/member/login_new.do?redirect=/reservation/golf-day_new.do",
};
const COURSE_NOTICES = {
  "코리아": { title: "코리아CC 예약 안내", msg: "코리아CC의 경우 예약신청일 전월 20일에 확정 여부 확인 가능합니다." },
  "크리스탈밸리": { title: "크리스탈밸리 예약 안내", msg: "크리스탈밸리의 경우 예약신청일 전월 2주차 화요일에 확정 여부 확인 가능합니다." },
  "설해원": { title: "설해원 예약 안내", msg: "설해원의 경우 예약신청일 전월 1주차 내 확정 여부 확인 가능합니다." },
};
const STATUS = {
  pending: { label: "대기중", color: "#b87d00", bg: "#fff8e1" },
  confirmed: { label: "확정", color: "#1a6e3a", bg: "#e8f5e9" },
  cancelled: { label: "취소", color: "#b71c1c", bg: "#ffebee" },
  cancel_request: { label: "취소요청", color: "#7b1fa2", bg: "#f3e5f5" },
};
const timeSlots = ["06:00","07:00","08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"];

const inputStyle = function(err) {
  return {
    width:"100%", padding:"9px 12px", fontSize:14,
    border:"1px solid " + (err ? "#e53935" : "#c8d8c0"),
    borderRadius:8, outline:"none", boxSizing:"border-box",
    background:"#fff", color:"#1a2e1a", fontFamily:"inherit"
  };
};
const labelStyle = { fontSize:13, fontWeight:500, color:"#4a6741", marginBottom:4, display:"block" };
const errStyle = { color:"#e53935", fontSize:11, marginTop:2 };
const btnPrimary = { padding:"11px", background:"#2e6b2e", color:"#fff", border:"none", borderRadius:9, fontSize:15, fontWeight:600, cursor:"pointer", width:"100%" };

function MiniCalendar(props) {
  var reservations = props.reservations;
  var selectedDate = props.selectedDate;
  var onSelect = props.onSelect;
  var today = new Date();
  var vy = React.useState(today.getFullYear());
  var setVy = vy[1]; vy = vy[0];
  var vm = React.useState(today.getMonth());
  var setVm = vm[1]; vm = vm[0];
  var first = new Date(vy, vm, 1).getDay();
  var days = new Date(vy, vm+1, 0).getDate();
  var resMap = {};
  reservations.filter(function(r){ return r.status !== "cancelled"; }).forEach(function(r) {
    var d = String(r.date||"").replace(/^'/,"").substring(0,10);
    if(!resMap[d]) resMap[d] = [];
    resMap[d].push(r.course);
  });
  var cells = [];
  for(var i=0;i<first;i++) cells.push(null);
  for(var d=1;d<=days;d++) cells.push(d);
  var mn = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  var wk = ["일","월","화","수","목","금","토"];
  return React.createElement("div", {style:{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:12,padding:12,minWidth:200,flexShrink:0}},
    React.createElement("div", {style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}},
      React.createElement("button", {onClick:function(){ if(vm===0){setVm(11);setVy(function(y){return y-1;});}else setVm(function(m){return m-1;}); }, style:{background:"none",border:"none",cursor:"pointer",color:"#2e6b2e",fontSize:16,padding:"2px 6px"}}, "‹"),
      React.createElement("span", {style:{fontSize:13,fontWeight:600,color:"#1a4a1a"}}, vy+"년 "+mn[vm]),
      React.createElement("button", {onClick:function(){ if(vm===11){setVm(0);setVy(function(y){return y+1;});}else setVm(function(m){return m+1;}); }, style:{background:"none",border:"none",cursor:"pointer",color:"#2e6b2e",fontSize:16,padding:"2px 6px"}}, "›")
    ),
    React.createElement("div", {style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}},
      wk.map(function(d){ return React.createElement("div", {key:d, style:{textAlign:"center",fontSize:10,color:"#9ab890",fontWeight:600,padding:"2px 0"}}, d); })
    ),
    React.createElement("div", {style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}},
      cells.map(function(day, i) {
        if(!day) return React.createElement("div", {key:"e"+i});
        var ds = vy+"-"+String(vm+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
        var isToday = vy===today.getFullYear()&&vm===today.getMonth()&&day===today.getDate();
        var isSel = ds===selectedDate;
        return React.createElement("div", {
          key:day,
          onClick:function(){ if(onSelect) onSelect(ds); },
          style:{textAlign:"center",padding:"4px 2px",borderRadius:6,fontSize:11,fontWeight:isToday?700:400,
            background:isSel?"#2e6b2e":isToday?"#c8e8b8":"transparent",
            color:isSel?"#fff":isToday?"#1a4a1a":"#2a3a2a",cursor:onSelect?"pointer":"default"}
        },
          day,
          resMap[ds]&&!isSel&&React.createElement("div", {style:{display:"flex",justifyContent:"center",gap:1,marginTop:1}},
            resMap[ds].slice(0,3).map(function(c,ci){
              return React.createElement("div", {key:ci, style:{width:4,height:4,borderRadius:"50%",background:COURSE_COLORS[c]||"#2e6b2e"}});
            })
          )
        );
      })
    ),
    React.createElement("div", {style:{marginTop:10,borderTop:"1px solid #c8e0be",paddingTop:8}},
      COURSES.map(function(c){
        return React.createElement("div", {key:c, style:{display:"flex",alignItems:"center",gap:6,marginBottom:3}},
          React.createElement("div", {style:{width:8,height:8,borderRadius:"50%",background:COURSE_COLORS[c],flexShrink:0}}),
          React.createElement("span", {style:{fontSize:11,color:"#4a6741"}}, c)
        );
      })
    )
  );
}

function App() {
  var loadingState = React.useState(true); var loading = loadingState[0]; var setLoading = loadingState[1];
  var savingState = React.useState(false); var saving = savingState[0]; var setSaving = savingState[1];
  var pageState = React.useState("home"); var page = pageState[0]; var setPage = pageState[1];
  var resState = React.useState([]); var reservations = resState[0]; var setReservations = resState[1];
  var formState = React.useState({empId:"",name:"",dept:"",empEmail:"",userEmpId:"",userEmpName:"",userDept:"",date:"",time:"",course:"",note:"",pw:"",pwConfirm:""});
  var form = formState[0]; var setForm = formState[1];
  var errState = React.useState({}); var errors = errState[0]; var setErrors = errState[1];
  var empLState = React.useState(false); var empLoading = empLState[0]; var setEmpLoading = empLState[1];
  var userEmpLState = React.useState(false); var userEmpLoading = userEmpLState[0]; var setUserEmpLoading = userEmpLState[1];
  var cnState = React.useState(null); var courseNotice = cnState[0]; var setCourseNotice = cnState[1];
  var dcState = React.useState(null); var dateConflict = dcState[0]; var setDateConflict = dcState[1];
  var lEmpIdState = React.useState(""); var lookupEmpId = lEmpIdState[0]; var setLookupEmpId = lEmpIdState[1];
  var lNameState = React.useState(""); var lookupName = lNameState[0]; var setLookupName = lNameState[1];
  var lDeptState = React.useState(""); var lookupDept = lDeptState[0]; var setLookupDept = lDeptState[1];
  var lEmpLState = React.useState(false); var lookupEmpLoading = lEmpLState[0]; var setLookupEmpLoading = lEmpLState[1];
  var lPwState = React.useState(""); var lookupPw = lPwState[0]; var setLookupPw = lPwState[1];
  var lErrState = React.useState(""); var lookupError = lErrState[0]; var setLookupError = lErrState[1];
  var myResState = React.useState(null); var myRes = myResState[0]; var setMyRes = myResState[1];
  var adminPwState = React.useState(""); var adminPw = adminPwState[0]; var setAdminPw = adminPwState[1];
  var adminErrState = React.useState(""); var adminError = adminErrState[0]; var setAdminError = adminErrState[1];
  var fsState = React.useState("all"); var filterStatus = fsState[0]; var setFilterStatus = fsState[1];
  var calSelState = React.useState(""); var calSel = calSelState[0]; var setCalSel = calSelState[1];
  var confirmModalState = React.useState(null); var confirmModal = confirmModalState[0]; var setConfirmModal = confirmModalState[1];
  var editModalState = React.useState(null); var editModal = editModalState[0]; var setEditModal = editModalState[1];

  React.useEffect(function() {
    (async function() {
      try {
        var res = await fetch(API_URL + "?action=getAll");
        var data = await res.json();
        if(Array.isArray(data)) setReservations(data);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  function setF(k, v) { setForm(function(f){ var o={};Object.assign(o,f);o[k]=v;return o; }); setErrors(function(e){ var o={};Object.assign(o,e);o[k]="";return o; }); }

  async function fetchEmployee(empId, type) {
    if(!empId.trim()) return;
    if(type==="user") setUserEmpLoading(true); else setEmpLoading(true);
    try {
      var res = await fetch(API_URL + "?action=getEmployee&empId=" + empId);
      var data = await res.json();
      if(data.success) {
        if(type==="user") setForm(function(f){ var o={};Object.assign(o,f);o.userEmpName=data.name;o.userDept=data.dept;return o; });
        else setForm(function(f){ var o={};Object.assign(o,f);o.name=data.name;o.dept=data.dept;o.empEmail=data.email||"";return o; });
      } else {
        if(type==="user") setForm(function(f){ var o={};Object.assign(o,f);o.userEmpName="";o.userDept="";return o; });
        else setForm(function(f){ var o={};Object.assign(o,f);o.name="";o.dept="";return o; });
      }
    } catch(e) { console.error(e); }
    if(type==="user") setUserEmpLoading(false); else setEmpLoading(false);
  }

  async function fetchLookupEmployee(empId) {
    if(!empId||!empId.trim()) return;
    setLookupEmpLoading(true);
    try {
      var res = await fetch(API_URL + "?action=getEmployee&empId=" + empId);
      var data = await res.json();
      if(data.success) { setLookupName(data.name); setLookupDept(data.dept); }
      else { setLookupName(""); setLookupDept(""); setLookupError("사번을 찾을 수 없습니다."); }
    } catch(e) { console.error(e); }
    setLookupEmpLoading(false);
  }

  React.useEffect(function() {
    if(!form.empId.trim()) { setForm(function(f){ var o={};Object.assign(o,f);o.name="";o.dept="";return o; }); return; }
    var t = setTimeout(function(){ fetchEmployee(form.empId,"applicant"); }, 800);
    return function(){ clearTimeout(t); };
  }, [form.empId]);

  React.useEffect(function() {
    if(!form.userEmpId.trim()) { setForm(function(f){ var o={};Object.assign(o,f);o.userEmpName="";o.userDept="";return o; }); return; }
    var t = setTimeout(function(){ fetchEmployee(form.userEmpId,"user"); }, 800);
    return function(){ clearTimeout(t); };
  }, [form.userEmpId]);

  React.useEffect(function() {
    if(!lookupEmpId.trim()) { setLookupName(""); setLookupDept(""); return; }
    var t = setTimeout(function(){ fetchLookupEmployee(lookupEmpId); }, 800);
    return function(){ clearTimeout(t); };
  }, [lookupEmpId]);

  function checkDateConflict(d) {
    var conflicts = reservations.filter(function(r) {
      if(String(r.status).replace(/^'/,"") === "cancelled") return false;
      var rd = String(r.date||"").replace(/^'/,"").substring(0,10);
      return rd === d;
    });
    setDateConflict(conflicts.length > 0 ? conflicts.length : null);
  }

  function validate() {
    var e = {};
    if(!form.empId.trim()) e.empId = "신청자 사번을 입력해주세요.";
    if(!form.name.trim()) e.name = "사번 조회를 해주세요.";
    if(!form.userEmpId.trim()) e.userEmpId = "이용자 사번을 입력해주세요.";
    if(!form.userEmpName.trim()) e.userEmpName = "사번 조회를 해주세요.";
    if(!form.date) e.date = "날짜를 선택해주세요.";
    if(!form.time) e.time = "시간을 선택해주세요.";
    if(!form.course) e.course = "골프장을 선택해주세요.";
    if(form.pw.length < 4) e.pw = "비밀번호 4자리 이상 입력해주세요.";
    if(form.pw !== form.pwConfirm) e.pwConfirm = "비밀번호가 일치하지 않습니다.";
    return e;
  }

  async function handleSubmit() {
    var e = validate();
    if(Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    try {
      var params = new URLSearchParams({
        action:"insert", name:form.name, dept:form.dept, date:form.date,
        time:form.time, course:form.course, note:form.note||"", pw:form.pw,
        empId:form.empId, empName:form.name, empEmail:form.empEmail||"",
        userEmpId:form.userEmpId, userEmpName:form.userEmpName, userDept:form.userDept
      });
      var res = await fetch(API_URL + "?" + params.toString());
      var data = await res.json();
      if(data.success) {
        var newR = {id:data.id, status:"pending"};
        Object.assign(newR, form);
        setReservations(function(prev){ return [newR].concat(prev); });
        setPage("success");
      }
    } catch(e) { console.error(e); }
    setSaving(false);
  }

  function handleLookup() {
    if(!lookupName.trim()) { setLookupError("먼저 사번 조회를 해주세요."); return; }
    if(!lookupPw.trim()) { setLookupError("비밀번호를 입력해주세요."); return; }
    var found = reservations.filter(function(r) {
      return String(r.name).replace(/^'/,"") === lookupName.trim() &&
             String(r.pw).replace(/^'/,"") === lookupPw.trim();
    });
    if(found.length === 0) { setLookupError("일치하는 예약 정보가 없습니다."); return; }
    setMyRes(found); setPage("myReservation");
  }

  async function requestCancel(id) {
    if(!window.confirm("취소 요청하시겠습니까? 담당자 승인 후 취소 처리됩니다.")) return;
    try {
      var params = new URLSearchParams({action:"updateStatus", id:id, status:"cancel_request"});
      await fetch(API_URL + "?" + params.toString());
      var res = await fetch(API_URL + "?action=getAll");
      var data = await res.json();
      if(Array.isArray(data)) {
        setReservations(data);
        setMyRes(function(prev){ return prev.map(function(r){ return r.id===id ? Object.assign({},r,{status:"cancel_request"}) : r; }); });
      }
    } catch(e) { console.error(e); }
  }

  async function changeStatus(id, status, courseDetail) {
    try {
      var params = new URLSearchParams({action:"updateStatus", id:id, status:status});
      if(courseDetail !== undefined) params.append("course_detail", courseDetail);
      await fetch(API_URL + "?" + params.toString());
      var res = await fetch(API_URL + "?action=getAll");
      var data = await res.json();
      if(Array.isArray(data)) setReservations(data);
    } catch(e) { console.error(e); }
  }

  function getAdminAlerts() {
    var today = new Date();
    var year = today.getFullYear(), month = today.getMonth()+1, day = today.getDate(), dow = today.getDay();
    var alerts = [];
    if(day>=5&&day<=10) alerts.push({type:"신청기간",course:"코리아",color:COURSE_COLORS["코리아"],bg:COURSE_BG["코리아"],msg:"코리아CC 예약 신청 기간입니다! (매월 5~10일, 오늘: "+month+"월 "+day+"일)",url:COURSE_URLS["코리아"]});
    if(day===20) alerts.push({type:"확정일",course:"코리아",color:"#b87d00",bg:"#fff8e1",msg:"오늘은 코리아CC 예약 확정일입니다! (전월 20일) 사이트에서 확정 여부를 확인하세요.",url:COURSE_URLS["코리아"]});
    reservations.filter(function(r){ return String(r.status).replace(/^'/,"")!=="cancelled"; }).forEach(function(r) {
      var course = String(r.course||"").replace(/^'/,"");
      if(course!=="크리스탈밸리"&&course!=="설해원") return;
      var dateStr = String(r.date||"").replace(/^'/,"").substring(0,10);
      if(!dateStr||dateStr.length<10) return;
      var resDate = new Date(dateStr), resYear = resDate.getFullYear(), resMonth = resDate.getMonth()+1;
      var userName = String(r.userEmpName||r.name||"").replace(/^'/,"");
      var siteUrl = COURSE_URLS[course];
      var am = resMonth-2, ay = resYear; if(am<=0){am+=12;ay-=1;}
      if(year===ay&&month===am&&day>=25&&day<=28) alerts.push({type:"신청기간",course:course,color:COURSE_COLORS[course],bg:COURSE_BG[course],msg:course+" 예약 신청 기간입니다!\n이용자: "+userName+" / 예약일: "+dateStr,url:siteUrl});
      var cm = resMonth-1, cy = resYear; if(cm<=0){cm+=12;cy-=1;}
      if(year===cy&&month===cm) {
        if(course==="크리스탈밸리"&&day>=8&&day<=14&&dow===2) alerts.push({type:"확정일",course:course,color:"#b87d00",bg:"#fff8e1",msg:"크리스탈밸리 예약 확정일!\n이용자: "+userName+" / 예약일: "+dateStr,url:siteUrl});
        if(course==="설해원"&&day>=1&&day<=7) alerts.push({type:"확정일",course:course,color:"#b87d00",bg:"#fff8e1",msg:"설해원 예약 확정 기간!\n이용자: "+userName+" / 예약일: "+dateStr,url:siteUrl});
      }
    });
    return alerts;
  }

  var filtered = (filterStatus==="all" ? reservations : reservations.filter(function(r){ return r.status===filterStatus; }))
    .filter(function(r){ return !calSel || String(r.date||"").replace(/^'/,"").substring(0,10)===calSel; });

  if(loading) return React.createElement("div", {style:{minHeight:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}},
    React.createElement("div", {style:{fontSize:36}}, "⛳"),
    React.createElement("p", {style:{color:"#4a6741",fontSize:15}}, "데이터를 불러오는 중...")
  );

  // HOME
  if(page==="home") {
    var today2 = new Date(), month2 = today2.getMonth()+1, day2 = today2.getDate();
    var korDday = day2<5 ? "D-"+(5-day2) : day2<=10 ? "접수중!" : "D-"+(new Date(today2.getFullYear(),month2,0).getDate()-day2+5);
    var crystalDday = day2<25 ? "D-"+(25-day2) : day2<=28 ? "접수중!" : "D-"+(new Date(today2.getFullYear(),month2,0).getDate()-day2+25);
    return React.createElement("div", {style:{minHeight:480,background:"linear-gradient(160deg,#e8f5e0 0%,#f0f7eb 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}},
      React.createElement("div", {style:{fontSize:48,marginBottom:8}}, "⛳"),
      React.createElement("h1", {style:{fontSize:26,fontWeight:700,color:"#1a4a1a",margin:"0 0 6px"}}, "SK스퀘어 골프예약 신청"),
      React.createElement("p", {style:{color:"#4a6741",fontSize:15,margin:"0 0 16px",textAlign:"center"}}, "임원(비서)전용 예약신청 페이지입니다."),
      React.createElement("div", {style:{background:"#fff",border:"1px solid #c8e0be",borderRadius:14,padding:"14px 20px",marginBottom:24,width:"100%",maxWidth:380,boxSizing:"border-box"}},
        React.createElement("p", {style:{fontSize:12,fontWeight:700,color:"#1a4a1a",margin:"0 0 10px",textAlign:"center"}}, "📅 골프장 접수 일정"),
        React.createElement("div", {style:{display:"flex",flexDirection:"column",gap:8}},
          [["코리아","코리아CC","매월 5~10일 (D-1개월)",korDday],["크리스탈밸리","크리스탈밸리","매월 25~28일 (D-2개월)",crystalDday],["설해원","설해원","매월 25~28일 (D-2개월)",crystalDday]].map(function(item) {
            var key=item[0],name=item[1],desc=item[2],dday=item[3];
            return React.createElement("div", {key:key, style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:COURSE_BG[key],borderRadius:9,padding:"8px 12px"}},
              React.createElement("div", null,
                React.createElement("span", {style:{fontSize:12,fontWeight:700,color:COURSE_COLORS[key]}}, name),
                React.createElement("span", {style:{fontSize:11,color:"#4a6741",marginLeft:6}}, desc)
              ),
              React.createElement("span", {style:{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,background:dday==="접수중!"?COURSE_COLORS[key]:"transparent",color:dday==="접수중!"?"#fff":COURSE_COLORS[key],border:"1px solid "+COURSE_COLORS[key]}}, dday)
            );
          })
        )
      ),
      React.createElement("div", {style:{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}},
        React.createElement("button", {onClick:function(){setPage("form");}, style:{padding:"12px 28px",background:"#2e6b2e",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:600,cursor:"pointer"}}, "예약 신청하기"),
        React.createElement("button", {onClick:function(){setPage("lookup");}, style:{padding:"12px 24px",background:"#fff",color:"#2e6b2e",border:"1.5px solid #2e6b2e",borderRadius:10,fontSize:15,fontWeight:500,cursor:"pointer"}}, "내 예약 확인"),
        React.createElement("button", {onClick:function(){setPage("adminLogin");}, style:{padding:"12px 20px",background:"#fff",color:"#555",border:"1px solid #c8d8c0",borderRadius:10,fontSize:14,cursor:"pointer"}}, "담당자 로그인")
      )
    );
  }

  // FORM
  if(page==="form") return React.createElement("div", {style:{padding:"1.5rem 1rem",maxWidth:700,margin:"0 auto"}},
    React.createElement("button", {onClick:function(){setPage("home");}, style:{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:14,padding:0,marginBottom:16}}, "← 홈으로"),
    React.createElement("div", {style:{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}},
      React.createElement("div", {style:{flex:1,minWidth:260,background:"#f3f9ef",borderRadius:12,padding:"1.4rem",border:"1px solid #c8e0be"}},
        React.createElement("h2", {style:{fontSize:18,fontWeight:700,color:"#1a4a1a",margin:"0 0 1rem"}}, "⛳ 예약 신청"),
        // 신청자
        React.createElement("div", {style:{background:"#eaf4e4",border:"1px solid #b8d8a8",borderRadius:9,padding:"12px",marginBottom:12}},
          React.createElement("p", {style:{fontSize:12,fontWeight:700,color:"#2e6b2e",margin:"0 0 8px"}}, "👤 신청자 (비서)"),
          React.createElement("label", {style:labelStyle}, "사번"),
          React.createElement("input", {type:"text",placeholder:"사번 입력 시 자동 조회",value:form.empId,onChange:function(e){setF("empId",e.target.value);},onBlur:function(){fetchEmployee(form.empId,"applicant");},onKeyDown:function(e){if(e.key==="Enter")fetchEmployee(form.empId,"applicant");},style:inputStyle(errors.empId)}),
          errors.empId&&React.createElement("p",{style:errStyle},errors.empId),
          empLoading&&React.createElement("p",{style:{fontSize:11,color:"#6a8e61",margin:"4px 0 0"}},"조회 중..."),
          form.name&&React.createElement("div",{style:{display:"flex",gap:10,background:"#fff",borderRadius:7,padding:"8px 10px",border:"1px solid #c8e0be",fontSize:13,marginTop:6}},
            React.createElement("span",{style:{color:"#4a6741"}},"이름: ",React.createElement("strong",null,form.name)),
            React.createElement("span",{style:{color:"#4a6741"}},"부서: ",React.createElement("strong",null,form.dept))
          ),
          errors.name&&React.createElement("p",{style:errStyle},errors.name)
        ),
        // 이용자
        React.createElement("div", {style:{background:"#e8eefa",border:"1px solid #b8c8f0",borderRadius:9,padding:"12px",marginBottom:12}},
          React.createElement("p", {style:{fontSize:12,fontWeight:700,color:"#1a3a6e",margin:"0 0 8px"}}, "👑 이용자 (임원)"),
          React.createElement("label", {style:labelStyle}, "사번"),
          React.createElement("input", {type:"text",placeholder:"사번 입력 시 자동 조회",value:form.userEmpId,onChange:function(e){setF("userEmpId",e.target.value);},onBlur:function(){fetchEmployee(form.userEmpId,"user");},onKeyDown:function(e){if(e.key==="Enter")fetchEmployee(form.userEmpId,"user");},style:inputStyle(errors.userEmpId)}),
          errors.userEmpId&&React.createElement("p",{style:errStyle},errors.userEmpId),
          userEmpLoading&&React.createElement("p",{style:{fontSize:11,color:"#6a8e61",margin:"4px 0 0"}},"조회 중..."),
          form.userEmpName&&React.createElement("div",{style:{display:"flex",gap:10,background:"#fff",borderRadius:7,padding:"8px 10px",border:"1px solid #b8c8f0",fontSize:13,marginTop:6}},
            React.createElement("span",{style:{color:"#1a3a6e"}},"이름: ",React.createElement("strong",null,form.userEmpName)),
            React.createElement("span",{style:{color:"#1a3a6e"}},"부서: ",React.createElement("strong",null,form.userDept))
          ),
          errors.userEmpName&&React.createElement("p",{style:errStyle},errors.userEmpName)
        ),
        // 날짜/시간
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}},
          React.createElement("div",null,
            React.createElement("label",{style:labelStyle},"날짜"),
            React.createElement("input",{type:"date",value:form.date,min:new Date().toISOString().split("T")[0],onChange:function(e){var d=e.target.value;setF("date",d);checkDateConflict(d);},style:inputStyle(errors.date)}),
            errors.date&&React.createElement("p",{style:errStyle},errors.date)
          ),
          React.createElement("div",null,
            React.createElement("label",{style:labelStyle},"티오프 시간"),
            React.createElement("select",{value:form.time,onChange:function(e){setF("time",e.target.value);},style:inputStyle(errors.time)},
              React.createElement("option",{value:""},"선택"),
              timeSlots.map(function(t){return React.createElement("option",{key:t,value:t},t);})
            ),
            errors.time&&React.createElement("p",{style:errStyle},errors.time)
          )
        ),
        // 골프장
        React.createElement("div",{style:{marginBottom:12}},
          React.createElement("label",{style:labelStyle},"골프장 선택"),
          React.createElement("div",{style:{display:"flex",gap:8}},
            COURSES.map(function(c){
              return React.createElement("button",{key:c,onClick:function(){setF("course",c);setCourseNotice(COURSE_NOTICES[c]);},
                style:{flex:1,padding:"9px 6px",borderRadius:8,border:form.course===c?"2px solid "+COURSE_COLORS[c]:"1px solid #c8d8c0",
                  background:form.course===c?COURSE_BG[c]:"#fff",color:form.course===c?COURSE_COLORS[c]:"#4a6741",
                  fontWeight:form.course===c?700:400,fontSize:13,cursor:"pointer"}},c);
            })
          ),
          errors.course&&React.createElement("p",{style:errStyle},errors.course)
        ),
        React.createElement("div",{style:{marginBottom:12}},
          React.createElement("label",{style:labelStyle},"요청사항 (선택)"),
          React.createElement("textarea",{placeholder:"기타 문의사항 등",value:form.note,onChange:function(e){setF("note",e.target.value);},rows:2,style:Object.assign({},inputStyle(false),{resize:"vertical"})})
        ),
        // 비밀번호
        React.createElement("div",{style:{background:"#eaf4e4",border:"1px solid #b8d8a8",borderRadius:9,padding:"12px",marginBottom:14}},
          React.createElement("p",{style:{fontSize:12,color:"#3a6e2a",margin:"0 0 10px",fontWeight:500}},"🔒 예약 조회용 비밀번호를 설정해주세요."),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
            React.createElement("div",null,
              React.createElement("label",{style:labelStyle},"비밀번호"),
              React.createElement("input",{type:"password",placeholder:"4자리 이상",value:form.pw,onChange:function(e){setF("pw",e.target.value);},style:inputStyle(errors.pw)}),
              errors.pw&&React.createElement("p",{style:errStyle},errors.pw)
            ),
            React.createElement("div",null,
              React.createElement("label",{style:labelStyle},"비밀번호 확인"),
              React.createElement("input",{type:"password",placeholder:"동일하게 입력",value:form.pwConfirm,onChange:function(e){setF("pwConfirm",e.target.value);},style:inputStyle(errors.pwConfirm)}),
              errors.pwConfirm&&React.createElement("p",{style:errStyle},errors.pwConfirm)
            )
          )
        ),
        React.createElement("button",{onClick:handleSubmit,disabled:saving,style:Object.assign({},btnPrimary,{opacity:saving?0.7:1})},saving?"저장 중...":"예약 신청 완료")
      ),
      // 달력 + 안내
      React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10,minWidth:200,maxWidth:220}},
        React.createElement(MiniCalendar,{reservations:reservations,selectedDate:form.date,onSelect:function(d){setF("date",d);checkDateConflict(d);}}),
        React.createElement("div",{style:{background:"#fff8e1",border:"1px solid #ffe082",borderRadius:12,padding:"12px 14px"}},
          React.createElement("p",{style:{fontSize:12,fontWeight:700,color:"#b87d00",margin:"0 0 6px"}},"⚠️ 예약 주의사항"),
          React.createElement("p",{style:{fontSize:11,color:"#7a5c00",lineHeight:1.65,margin:0}},
            "예약 취소는 이용일 ",React.createElement("strong",null,"최소 10일 전"),"까지 담당자에게 연락 바랍니다.",React.createElement("br"),
            React.createElement("span",{style:{color:"#c0392b"}},"(법인명의로 패널티 부여되므로 꼭 연락주시기 바랍니다.)")
          )
        ),
        React.createElement("div",{style:{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:12,padding:"12px 14px"}},
          React.createElement("p",{style:{fontSize:12,fontWeight:700,color:"#1a4a1a",margin:"0 0 8px"}},"⛳ 골프장별 예약 확정일",React.createElement("br"),React.createElement("span",{style:{fontSize:10,fontWeight:400,color:"#6a8e61"}},"(이용일 기준)")),
          (function(){
            var today3=new Date(), nm=(today3.getMonth()+2)>12?1:today3.getMonth()+2;
            var ny=(today3.getMonth()+2)>12?today3.getFullYear()+1:today3.getFullYear();
            var cm=nm-1<=0?12:nm-1, cy=nm-1<=0?ny-1:ny;
            var tue=8; for(var d=8;d<=14;d++){if(new Date(cy,cm-1,d).getDay()===2){tue=d;break;}}
            return [
              ["코리아CC","#1a5c2e","#e8f5e0","전월 20일 확정","ex) "+nm+"/27 이용일, "+cm+"/20 확정"],
              ["크리스탈밸리","#1a3a6e","#e3ecfa","전월 2주차 화요일 확정","ex) "+nm+"/27 이용일, "+cm+"/"+tue+" 확정"],
              ["설해원","#8b1a1a","#faeaea","전월 1주차 내 확정","ex) "+nm+"/27 이용일, "+cm+"/7 확정"],
            ].map(function(item){
              return React.createElement("div",{key:item[0],style:{display:"flex",flexDirection:"column",background:item[2],borderRadius:8,padding:"6px 9px",marginBottom:5}},
                React.createElement("span",{style:{fontSize:11,fontWeight:700,color:item[1]}},item[0]),
                React.createElement("span",{style:{fontSize:11,color:"#444",marginTop:1}},item[3]),
                React.createElement("span",{style:{fontSize:10,color:"#888",marginTop:2}},item[4])
              );
            });
          })()
        ),
        React.createElement("div",{style:{background:"#f0f4ff",border:"1px solid #c5cff5",borderRadius:12,padding:"12px 14px"}},
          React.createElement("p",{style:{fontSize:12,fontWeight:700,color:"#1a2e6e",margin:"0 0 6px"}},"📞 문의처 / 담당자"),
          React.createElement("p",{style:{fontSize:11,color:"#2a3a6e",lineHeight:1.7,margin:0}},
            "HR ",React.createElement("strong",null,"홍미소"),React.createElement("br"),
            React.createElement("a",{href:"mailto:miso.hong@sk.com",style:{color:"#1a3a6e",textDecoration:"none"}},"miso.hong@sk.com"),React.createElement("br"),
            React.createElement("a",{href:"tel:010-2101-6313",style:{color:"#1a3a6e",textDecoration:"none",fontWeight:600}},"010-2101-6313")
          )
        )
      )
    ),
    // 날짜 중복 팝업
    dateConflict&&React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999},onClick:function(){setDateConflict(null);}},
      React.createElement("div",{onClick:function(e){e.stopPropagation();},style:{background:"#fff",borderRadius:14,padding:"2rem 1.8rem",maxWidth:300,width:"90%",boxSizing:"border-box",border:"1px solid #ffe082",textAlign:"center"}},
        React.createElement("div",{style:{fontSize:36,marginBottom:10}},"⚠️"),
        React.createElement("h3",{style:{fontSize:15,fontWeight:700,color:"#b87d00",margin:"0 0 10px"}},"동일 날짜 신청 안내"),
        React.createElement("p",{style:{fontSize:14,color:"#7a5c00",lineHeight:1.75,margin:"0 0 20px",background:"#fff8e1",borderRadius:9,padding:"12px 14px",border:"1px solid #ffe082"}},
          "동일한 날짜에 ",React.createElement("strong",null,dateConflict),"명의 신청건이 있습니다."
        ),
        React.createElement("button",{onClick:function(){setDateConflict(null);},style:Object.assign({},btnPrimary,{width:"auto",padding:"10px 28px",background:"#e6a817"})},"확인")
      )
    ),
    // 골프장 팝업
    courseNotice&&React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999},onClick:function(){setCourseNotice(null);}},
      React.createElement("div",{onClick:function(e){e.stopPropagation();},style:{background:"#fff",borderRadius:14,padding:"2rem 1.8rem",maxWidth:320,width:"90%",boxSizing:"border-box",border:"1px solid #c8e0be",textAlign:"center"}},
        React.createElement("div",{style:{fontSize:36,marginBottom:10}},"📋"),
        React.createElement("h3",{style:{fontSize:16,fontWeight:700,color:"#1a4a1a",margin:"0 0 10px"}},courseNotice.title),
        React.createElement("p",{style:{fontSize:14,color:"#4a6741",lineHeight:1.75,margin:"0 0 20px",background:"#f3f9ef",borderRadius:9,padding:"12px 14px",border:"1px solid #c8e0be"}},courseNotice.msg),
        React.createElement("button",{onClick:function(){setCourseNotice(null);},style:Object.assign({},btnPrimary,{width:"auto",padding:"10px 32px"})},"확인")
      )
    )
  );

  // SUCCESS
  if(page==="success") return React.createElement("div",{style:{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}},
    React.createElement("div",{style:{maxWidth:380,textAlign:"center",background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:16,padding:"2.5rem 2rem"}},
      React.createElement("div",{style:{fontSize:50,marginBottom:10}},"✅"),
      React.createElement("h2",{style:{fontSize:21,fontWeight:700,color:"#1a4a1a",margin:"0 0 10px"}},"예약 신청이 완료되었습니다!"),
      React.createElement("p",{style:{color:"#4a6741",fontSize:14,lineHeight:1.7,margin:"0 0 18px"}},"담당자 확인 후 순차적으로 안내 드리겠습니다."),
      React.createElement("div",{style:{background:"#fff",border:"1px solid #c8e0be",borderRadius:10,padding:"1rem",textAlign:"left",marginBottom:16,fontSize:14}},
        [["신청자",form.name],["신청자 부서",form.dept],["이용자",form.userEmpName],["이용자 부서",form.userDept],["골프장",form.course],["날짜",form.date],["시간",form.time]].map(function(item){
          return React.createElement("div",{key:item[0],style:{display:"flex",justifyContent:"space-between",marginBottom:5}},
            React.createElement("span",{style:{color:"#4a6741"}},item[0]),
            React.createElement("strong",{style:{color:item[0]==="골프장"?COURSE_COLORS[item[1]]:"#1a4a1a"}},item[1])
          );
        })
      ),
      React.createElement("div",{style:{background:"#eaf4e4",border:"1px solid #b8d8a8",borderRadius:9,padding:"10px 14px",marginBottom:20,fontSize:13,color:"#3a6e2a",textAlign:"left"}},
        "🔒 설정한 비밀번호로 ",React.createElement("strong",null,"내 예약 확인"),"에서 조회하실 수 있습니다."
      ),
      React.createElement("button",{onClick:function(){setPage("home");setForm({empId:"",name:"",dept:"",empEmail:"",userEmpId:"",userEmpName:"",userDept:"",date:"",time:"",course:"",note:"",pw:"",pwConfirm:""});setErrors({});},style:Object.assign({},btnPrimary,{width:"auto",padding:"11px 28px"})},"홈으로 돌아가기")
    )
  );

  // LOOKUP
  if(page==="lookup") return React.createElement("div",{style:{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}},
    React.createElement("div",{style:{width:320,background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:14,padding:"2rem"}},
      React.createElement("button",{onClick:function(){setPage("home");},style:{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:13,padding:0,marginBottom:14}},"← 홈으로"),
      React.createElement("div",{style:{textAlign:"center",marginBottom:18}},
        React.createElement("div",{style:{fontSize:32}},"🔍"),
        React.createElement("h2",{style:{fontSize:17,fontWeight:700,color:"#1a4a1a",margin:"8px 0 0"}},"내 예약 확인"),
        React.createElement("p",{style:{fontSize:12,color:"#6a8e61",margin:"6px 0 0"}},"사번 입력 시 자동 조회됩니다.")
      ),
      React.createElement("div",{style:{marginBottom:8}},
        React.createElement("label",{style:labelStyle},"사번"),
        React.createElement("input",{type:"text",placeholder:"사번 입력",value:lookupEmpId,onChange:function(e){setLookupEmpId(e.target.value);setLookupError("");},onBlur:function(){fetchLookupEmployee(lookupEmpId);},onKeyDown:function(e){if(e.key==="Enter")fetchLookupEmployee(lookupEmpId);},style:inputStyle(false)})
      ),
      lookupEmpLoading&&React.createElement("p",{style:{fontSize:11,color:"#6a8e61",margin:"4px 0 6px"}},"조회 중..."),
      lookupName&&React.createElement("div",{style:{display:"flex",gap:10,background:"#f3f9ef",borderRadius:7,padding:"8px 10px",border:"1px solid #c8e0be",fontSize:13,marginBottom:10}},
        React.createElement("span",{style:{color:"#4a6741"}},"이름: ",React.createElement("strong",null,lookupName)),
        React.createElement("span",{style:{color:"#4a6741"}},"부서: ",React.createElement("strong",null,lookupDept))
      ),
      React.createElement("div",{style:{marginBottom:14}},
        React.createElement("label",{style:labelStyle},"비밀번호"),
        React.createElement("input",{type:"password",placeholder:"설정한 비밀번호",value:lookupPw,onChange:function(e){setLookupPw(e.target.value);setLookupError("");},onKeyDown:function(e){if(e.key==="Enter")handleLookup();},style:inputStyle(!!lookupError)})
      ),
      lookupError&&React.createElement("p",{style:Object.assign({},errStyle,{marginBottom:8,fontSize:13})},lookupError),
      React.createElement("button",{onClick:handleLookup,style:btnPrimary},"예약 조회")
    )
  );

  // MY RESERVATION
  if(page==="myReservation") {
    var todayStr = new Date().toISOString().split("T")[0];
    var sorted = myRes.slice().sort(function(a,b){
      var da=String(a.date||"").replace(/^'/,"").substring(0,10);
      var db=String(b.date||"").replace(/^'/,"").substring(0,10);
      return da>db?-1:da<db?1:0;
    });
    var groups = {};
    sorted.forEach(function(r){
      var key=r.userEmpName||"-";
      if(!groups[key]) groups[key]={name:r.userEmpName||"-",dept:r.userDept||"",items:[]};
      groups[key].items.push(r);
    });
    return React.createElement("div",{style:{maxWidth:680,margin:"0 auto",padding:"1.5rem 1rem"}},
      React.createElement("button",{onClick:function(){setPage("home");setLookupEmpId("");setLookupName("");setLookupDept("");setLookupPw("");setMyRes(null);setLookupError("");},style:{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:14,padding:0,marginBottom:16}},"← 홈으로"),
      React.createElement("div",{style:{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:12,padding:"1.2rem",marginBottom:16}},
        React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10}},
          React.createElement("div",{style:{width:40,height:40,borderRadius:"50%",background:"#d4ead4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#2e6b2e"}},lookupName.slice(0,1)),
          React.createElement("div",null,
            React.createElement("p",{style:{margin:0,fontWeight:700,fontSize:16,color:"#1a4a1a"}},lookupName),
            React.createElement("p",{style:{margin:0,fontSize:13,color:"#6a8e61"}},lookupDept)
          )
        )
      ),
      React.createElement("p",{style:{fontSize:13,color:"#4a6741",margin:"0 0 12px"}},"총 ",React.createElement("strong",null,myRes.length),"건의 예약 내역입니다."),
      Object.values(groups).map(function(group,gi){
        return React.createElement("div",{key:gi,style:{marginBottom:16,background:"#fff",border:"1px solid #c8e0be",borderRadius:12,overflow:"hidden"}},
          React.createElement("div",{style:{background:"#e8eefa",borderBottom:"1px solid #c8d8f0",padding:"10px 16px",display:"flex",alignItems:"center",gap:8}},
            React.createElement("span",{style:{fontSize:16}},"👑"),
            React.createElement("span",{style:{fontWeight:700,fontSize:14,color:"#1a3a6e"}},group.name),
            group.dept&&React.createElement("span",{style:{fontSize:12,color:"#6a8e61"}},"("+group.dept+")"),
            React.createElement("span",{style:{marginLeft:"auto",fontSize:12,color:"#6a8e61",background:"#fff",padding:"2px 10px",borderRadius:20,border:"1px solid #c8d8f0"}},group.items.length+"건")
          ),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 0.8fr 1.2fr 0.9fr",background:"#c8e0be",padding:"8px 16px",gap:8}},
            ["골프장","이용일","시간","진행상태",""].map(function(h,i){return React.createElement("div",{key:i,style:{fontSize:11,fontWeight:700,color:"#2e6b2e",textAlign:"center"}},h);})
          ),
          group.items.map(function(r,i){
            var rDate=String(r.date||"").replace(/^'/,"").substring(0,10);
            var isPast = rDate < todayStr;
            return React.createElement("div",{key:r.id,style:{display:"grid",gridTemplateColumns:"1fr 1fr 0.8fr 1.2fr 0.9fr",padding:"10px 16px",gap:8,
              borderTop:i===0?"none":"1px solid #e8f0e4",
              background:r.status==="confirmed"?"#f3fdf5":r.status==="cancelled"?"#fff8f8":r.status==="cancel_request"?"#fdf3ff":"#fff",
              boxShadow:r.status==="confirmed"?"inset 3px 0 0 #1a6e3a":r.status==="cancelled"?"inset 3px 0 0 #e53935":r.status==="cancel_request"?"inset 3px 0 0 #7b1fa2":"none"}},
              React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}},
                React.createElement("span",{style:{fontSize:12,fontWeight:600,padding:"2px 10px",borderRadius:10,background:COURSE_BG[r.course],color:COURSE_COLORS[r.course]}},r.course),
                r.course_detail&&React.createElement("span",{style:{fontSize:10,color:"#6a8e61"}},r.course_detail)
              ),
              React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement("span",{style:{fontSize:12,color:"#1a2e1a",fontWeight:600}},rDate)),
              React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement("span",{style:{fontSize:12,color:"#1a2e1a",fontWeight:600}},r.time)),
              React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},
                React.createElement("span",{style:{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,
                  background:STATUS[r.status]?STATUS[r.status].bg:"#eee",
                  color:STATUS[r.status]?STATUS[r.status].color:"#333",
                  border:"1.5px solid "+(STATUS[r.status]?STATUS[r.status].color:"#ccc"),
                  boxShadow:r.status==="confirmed"?"0 0 6px rgba(26,110,58,0.25)":"none"}},
                  r.status==="confirmed"?"✅ 확정":r.status==="cancelled"?"❌ 취소":r.status==="cancel_request"?"🔔 취소요청":"⏳ 대기중"
                )
              ),
              React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},
                (r.status==="pending"||(r.status==="confirmed"&&!isPast))&&
                React.createElement("button",{onClick:function(){requestCancel(r.id);},style:{padding:"3px 8px",background:"#f3e5f5",color:"#7b1fa2",border:"1px solid #ce93d8",borderRadius:6,fontSize:11,cursor:"pointer"}},"취소요청")
              )
            );
          }),
          group.items.some(function(r){return r.note;})&&React.createElement("div",{style:{padding:"8px 16px",borderTop:"1px solid #e8f0e4",background:"#fafff8"}},
            group.items.filter(function(r){return r.note;}).map(function(r){
              return React.createElement("div",{key:r.id,style:{fontSize:11,color:"#4a6741",marginBottom:3}},
                "📝 ",React.createElement("strong",null,String(r.date||"").replace(/^'/,"").substring(0,10))," — ",r.note
              );
            })
          )
        );
      })
    );
  }

  // ADMIN LOGIN
  if(page==="adminLogin") return React.createElement("div",{style:{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}},
    React.createElement("div",{style:{width:300,background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:14,padding:"2rem"}},
      React.createElement("button",{onClick:function(){setPage("home");},style:{background:"none",border:"none",color:"#2e6b2e",cursor:"pointer",fontSize:13,padding:0,marginBottom:14}},"← 홈으로"),
      React.createElement("div",{style:{textAlign:"center",marginBottom:18}},
        React.createElement("div",{style:{fontSize:30}},"🔐"),
        React.createElement("h2",{style:{fontSize:17,fontWeight:700,color:"#1a4a1a",margin:"8px 0 0"}},"담당자 로그인")
      ),
      React.createElement("label",{style:labelStyle},"비밀번호"),
      React.createElement("input",{type:"password",placeholder:"비밀번호 입력",value:adminPw,onChange:function(e){setAdminPw(e.target.value);setAdminError("");},onKeyDown:function(e){if(e.key==="Enter"){if(adminPw===ADMIN_PASSWORD)setPage("admin");else setAdminError("비밀번호가 올바르지 않습니다.");}},style:inputStyle(!!adminError)}),
      adminError&&React.createElement("p",{style:errStyle},adminError),
      React.createElement("button",{onClick:function(){if(adminPw===ADMIN_PASSWORD)setPage("admin");else setAdminError("비밀번호가 올바르지 않습니다.");},style:Object.assign({},btnPrimary,{marginTop:12})},"로그인")
    )
  );

  // ADMIN
  var adminAlerts = getAdminAlerts();
  var groupsAdmin = {};
  filtered.forEach(function(r){
    var key=r.userEmpName||"-";
    if(!groupsAdmin[key]) groupsAdmin[key]={name:r.userEmpName||"-",dept:r.userDept||"",items:[]};
    groupsAdmin[key].items.push(r);
  });

  return React.createElement("div",{style:{padding:"1.2rem 1rem",maxWidth:900,margin:"0 auto"}},
    // 상단
    React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}},
      React.createElement("h2",{style:{fontSize:19,fontWeight:700,color:"#1a4a1a",margin:0}},"⛳ 예약 관리"),
      React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
        COURSES.map(function(c){
          return React.createElement("a",{key:c,href:COURSE_URLS[c],target:"_blank",rel:"noreferrer",style:{padding:"7px 12px",background:COURSE_BG[c],color:COURSE_COLORS[c],border:"1px solid "+COURSE_COLORS[c]+"40",borderRadius:8,fontSize:12,fontWeight:600,textDecoration:"none"}},c+" 🔗");
        }),
        React.createElement("button",{onClick:function(){
          var header=["ID","이름","부서","날짜","시간","골프장","코스","요청사항","상태","신청일","신청자사번","신청자","이용자사번","이용자","이용자부서"];
          var rows=reservations.map(function(r){return[r.id,r.name,r.dept,r.date,r.time,r.course,r.course_detail||"",r.note||"",STATUS[r.status]?STATUS[r.status].label:r.status,r.created_at||"",r.empId||"",r.empName||"",r.userEmpId||"",r.userEmpName||"",r.userDept||""];});
          var csv=[header].concat(rows).map(function(r){return r.map(function(v){return'"'+String(v).replace(/"/g,'""')+'"';}).join(",");}).join("\n");
          var blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
          var url=URL.createObjectURL(blob);
          var a=document.createElement("a");a.href=url;a.download="골프예약목록.csv";a.click();URL.revokeObjectURL(url);
        },style:{padding:"7px 14px",background:"#e8f5e9",color:"#1a6e3a",border:"1px solid #a5d6a7",borderRadius:8,fontSize:13,cursor:"pointer",fontWeight:500}},"📥 엑셀 다운로드"),
        React.createElement("button",{onClick:function(){setPage("home");setAdminPw("");},style:{padding:"7px 14px",background:"none",border:"1px solid #c8e0be",borderRadius:8,color:"#4a6741",fontSize:13,cursor:"pointer"}},"로그아웃")
      )
    ),
    // 확정 팝업
    confirmModal&&React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999},onClick:function(){setConfirmModal(null);}},
      React.createElement("div",{onClick:function(e){e.stopPropagation();},style:{background:"#fff",borderRadius:14,padding:"2rem",maxWidth:320,width:"90%",boxSizing:"border-box",border:"1px solid #c8e0be"}},
        React.createElement("h3",{style:{fontSize:16,fontWeight:700,color:"#1a4a1a",margin:"0 0 6px"}},"✅ 예약 확정"),
        React.createElement("p",{style:{fontSize:12,color:"#6a8e61",margin:"0 0 16px"}},"배정 코스를 입력 후 확정해 주세요. (선택)"),
        React.createElement("label",{style:labelStyle},"배정 코스"),
        React.createElement("input",{type:"text",placeholder:"예: 레이크코스 07:45",value:confirmModal.courseDetail,onChange:function(e){setConfirmModal(function(m){return Object.assign({},m,{courseDetail:e.target.value});});},style:Object.assign({},inputStyle(false),{marginBottom:20})}),
        React.createElement("div",{style:{display:"flex",gap:8}},
          React.createElement("button",{onClick:function(){changeStatus(confirmModal.id,"confirmed",confirmModal.courseDetail);setConfirmModal(null);},style:Object.assign({},btnPrimary,{flex:1})},"확정"),
          React.createElement("button",{onClick:function(){setConfirmModal(null);},style:{flex:1,padding:"11px",background:"#f3f3f3",color:"#555",border:"1px solid #ddd",borderRadius:9,fontSize:14,cursor:"pointer"}},"취소")
        )
      )
    ),
    // 알림 배너
    React.createElement("div",{style:{marginBottom:16}},
      adminAlerts.length===0?
        React.createElement("div",{style:{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#4a6741"}},"✅ 오늘은 신청기간 및 확정일 알림이 없습니다."):
        adminAlerts.map(function(a,i){
          return React.createElement("div",{key:i,style:{background:a.bg,border:"1px solid "+a.color+"40",borderLeft:"4px solid "+a.color,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:8}},
            React.createElement("div",null,
              React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:4}},
                React.createElement("span",{style:{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10,background:a.color,color:"#fff"}},a.type==="신청기간"?"📝 신청기간":"✅ 확정일"),
                React.createElement("span",{style:{fontSize:12,fontWeight:700,color:a.color}},a.course)
              ),
              React.createElement("p",{style:{fontSize:12,color:"#333",margin:0,lineHeight:1.6,whiteSpace:"pre-line"}},a.msg)
            ),
            React.createElement("a",{href:a.url,target:"_blank",rel:"noreferrer",style:{flexShrink:0,padding:"6px 12px",background:a.color,color:"#fff",borderRadius:7,fontSize:12,fontWeight:600,textDecoration:"none"}},"사이트 이동 🔗")
          );
        })
    ),
    React.createElement("div",{style:{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}},
      React.createElement("div",{style:{flex:1,minWidth:280}},
        // 요약
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}},
          [["전체",reservations.length,"#1a4a1a"],["대기중",reservations.filter(function(r){return r.status==="pending";}).length,"#b87d00"],["확정",reservations.filter(function(r){return r.status==="confirmed";}).length,"#1a6e3a"],["취소요청",reservations.filter(function(r){return r.status==="cancel_request";}).length,"#7b1fa2"],["취소",reservations.filter(function(r){return r.status==="cancelled";}).length,"#b71c1c"]].map(function(item){
            return React.createElement("div",{key:item[0],style:{background:"#f3f9ef",border:"1px solid #c8e0be",borderRadius:10,padding:"10px",textAlign:"center"}},
              React.createElement("div",{style:{fontSize:18,fontWeight:700,color:item[2]}},item[1]),
              React.createElement("div",{style:{fontSize:10,color:"#6a8e61",marginTop:1}},item[0])
            );
          })
        ),
        // 필터
        React.createElement("div",{style:{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}},
          [["all","전체"],["pending","대기중"],["confirmed","확정"],["cancel_request","취소요청"],["cancelled","취소"]].map(function(item){
            return React.createElement("button",{key:item[0],onClick:function(){setFilterStatus(item[0]);},style:{padding:"5px 12px",borderRadius:20,border:"1px solid "+(filterStatus===item[0]?"#2e6b2e":"#c8e0be"),background:filterStatus===item[0]?"#2e6b2e":"#fff",color:filterStatus===item[0]?"#fff":"#4a6741",fontSize:12,cursor:"pointer"}},item[1]);
          }),
          calSel&&React.createElement("button",{onClick:function(){setCalSel("");},style:{padding:"5px 12px",borderRadius:20,border:"1px solid #e8b0b0",background:"#fff5f5",color:"#b71c1c",fontSize:12,cursor:"pointer"}},calSel+" ✕")
        ),
        // 그룹 테이블
        filtered.length===0?React.createElement("p",{style:{color:"#9ab890",textAlign:"center",padding:"1.5rem",fontSize:14}},"예약 내역이 없습니다."):
        Object.values(groupsAdmin).map(function(group,gi){
          return React.createElement("div",{key:gi,style:{marginBottom:16,background:"#fff",border:"1px solid #c8e0be",borderRadius:12,overflow:"hidden"}},
            React.createElement("div",{style:{background:"#e8eefa",borderBottom:"1px solid #c8d8f0",padding:"10px 16px",display:"flex",alignItems:"center",gap:8}},
              React.createElement("span",{style:{fontSize:16}},"👑"),
              React.createElement("span",{style:{fontWeight:700,fontSize:14,color:"#1a3a6e"}},group.name),
              group.dept&&React.createElement("span",{style:{fontSize:12,color:"#6a8e61"}},"("+group.dept+")"),
              React.createElement("span",{style:{marginLeft:"auto",fontSize:12,color:"#6a8e61",background:"#fff",padding:"2px 10px",borderRadius:20,border:"1px solid #c8d8f0"}},group.items.length+"건")
            ),
            React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 0.8fr 0.8fr 1.2fr 1.2fr",background:"#c8e0be",padding:"8px 16px",gap:8}},
              ["신청자","골프장","코스","이용일","시간","진행상태","액션"].map(function(h){
                return React.createElement("div",{key:h,style:{fontSize:11,fontWeight:700,color:"#2e6b2e",textAlign:"center"}},h);
              })
            ),
            group.items.map(function(r,i){
              return React.createElement("div",{key:r.id,style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 0.8fr 0.8fr 1.2fr 1.2fr",padding:"10px 16px",gap:8,
                borderTop:i===0?"none":"1px solid #e8f0e4",
                background:r.status==="confirmed"?"#f3fdf5":r.status==="cancelled"?"#fff8f8":r.status==="cancel_request"?"#fdf3ff":"#fff",
                boxShadow:r.status==="confirmed"?"inset 3px 0 0 #1a6e3a":r.status==="cancelled"?"inset 3px 0 0 #e53935":r.status==="cancel_request"?"inset 3px 0 0 #7b1fa2":"none"}},
                React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}},
                  React.createElement("span",{style:{fontSize:12,fontWeight:600,color:"#1a4a1a"}},r.empName||r.name),
                  React.createElement("span",{style:{fontSize:10,color:"#9ab890"}},r.dept)
                ),
                React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},
                  React.createElement("span",{style:{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:10,background:COURSE_BG[r.course],color:COURSE_COLORS[r.course]}},r.course)
                ),
                React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},
                  React.createElement("span",{style:{fontSize:11,color:"#4a6741"}},r.course_detail||"-")
                ),
                React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},
                  React.createElement("span",{style:{fontSize:11,fontWeight:600,color:"#1a2e1a"}},String(r.date||"").replace(/^'/,"").substring(0,10))
                ),
                React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},
                  React.createElement("span",{style:{fontSize:11,fontWeight:600,color:"#1a2e1a"}},r.time)
                ),
                React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},
                  React.createElement("span",{style:{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20,
                    background:STATUS[r.status]?STATUS[r.status].bg:"#eee",
                    color:STATUS[r.status]?STATUS[r.status].color:"#333",
                    border:"1px solid "+(STATUS[r.status]?STATUS[r.status].color:"#ccc")}},
                    r.status==="confirmed"?"✅ 확정":r.status==="cancelled"?"❌ 취소":r.status==="cancel_request"?"🔔 취소요청":"⏳ 대기중"
                  )
                ),
                React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:4,flexWrap:"wrap"}},
                  r.status!=="confirmed"&&r.status!=="cancel_request"&&React.createElement("button",{onClick:function(){setConfirmModal({id:r.id,courseDetail:r.course_detail||""});},style:{padding:"3px 8px",background:"#e8f5e9",color:"#1a6e3a",border:"1px solid #a5d6a7",borderRadius:6,fontSize:11,cursor:"pointer"}},"확정"),
                  r.status!=="pending"&&r.status!=="cancelled"&&r.status!=="cancel_request"&&React.createElement("button",{onClick:function(){changeStatus(r.id,"pending");},style:{padding:"3px 8px",background:"#fff8e1",color:"#b87d00",border:"1px solid #ffe082",borderRadius:6,fontSize:11,cursor:"pointer"}},"대기중"),
                  r.status==="cancel_request"&&React.createElement(React.Fragment,null,
                    React.createElement("button",{onClick:function(){changeStatus(r.id,"cancelled");},style:{padding:"3px 8px",background:"#ffebee",color:"#b71c1c",border:"1px solid #ffcdd2",borderRadius:6,fontSize:11,cursor:"pointer",fontWeight:600}},"취소승인"),
                    React.createElement("button",{onClick:function(){changeStatus(r.id,"pending");},style:{padding:"3px 8px",background:"#fff8e1",color:"#b87d00",border:"1px solid #ffe082",borderRadius:6,fontSize:11,cursor:"pointer"}},"거절")
                  ),
                  r.status!=="cancelled"&&r.status!=="cancel_request"&&React.createElement("button",{onClick:function(){changeStatus(r.id,"cancelled");},style:{padding:"3px 8px",background:"#ffebee",color:"#b71c1c",border:"1px solid #ffcdd2",borderRadius:6,fontSize:11,cursor:"pointer"}},"취소")
                )
              );
            }),
            group.items.some(function(r){return r.note;})&&React.createElement("div",{style:{padding:"8px 16px",borderTop:"1px solid #e8f0e4",background:"#fafff8"}},
              group.items.filter(function(r){return r.note;}).map(function(r){
                return React.createElement("div",{key:r.id,style:{fontSize:11,color:"#4a6741",marginBottom:3}},
                  "📝 ",React.createElement("strong",null,r.empName||r.name)," (",String(r.date||"").replace(/^'/,"").substring(0,10),") — ",r.note
                );
              })
            )
          );
        })
      ),
      React.createElement(MiniCalendar,{reservations:reservations,selectedDate:calSel,onSelect:function(d){setCalSel(function(prev){return prev===d?"":d;});}})
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
