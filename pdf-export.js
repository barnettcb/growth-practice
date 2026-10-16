(function(global){
'use strict';

const PAGE_W=612, PAGE_H=792, M=38, CONTENT_W=PAGE_W-(M*2), BOTTOM=38;

function ascii(value=''){
  return String(value)
    .replace(/[\u2013\u2014]/g,'-')
    .replace(/[\u2018\u2019]/g,"'")
    .replace(/[\u201c\u201d]/g,'"')
    .replace(/\u2022/g,'-')
    .replace(/\u2713/g,'X')
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g,'?');
}
function escPdfText(s){return ascii(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function approxWidth(text,size){return ascii(text).length*size*0.50;}
function wrap(text,size,maxWidth){
  const paragraphs=ascii(text).split(/\r?\n/); const out=[];
  for(const para of paragraphs){
    if(!para){out.push('');continue;}
    const maxChars=Math.max(2,Math.floor(maxWidth/(size*0.56)));const words=para.split(/\s+/).flatMap(word=>{const chunks=[];while(word.length>maxChars){chunks.push(word.slice(0,maxChars));word=word.slice(maxChars);}chunks.push(word);return chunks;}); let line='';
    for(const word of words){
      const candidate=line?`${line} ${word}`:word;
      if(line && approxWidth(candidate,size)>maxWidth){out.push(line);line=word;} else line=candidate;
    }
    if(line) out.push(line);
  }
  return out.length?out:[''];
}
function textCmd(text,x,y,size=9,bold=false){return `BT /${bold?'F2':'F1'} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escPdfText(text)}) Tj ET\n`;}
function lineCmd(x1,y1,x2,y2,width=.5){return `${width} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S\n`;}
function rectCmd(x,y,w,h,width=.5){return `${width} w ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S\n`;}

class ReportPainter{
  constructor(){this.pages=[[]];this.y=PAGE_H-M;}
  page(){return this.pages[this.pages.length-1];}
  add(cmd){this.page().push(cmd);}
  newPage(){this.pages.push([]);this.y=PAGE_H-M;}
  ensure(h){if(this.y-h<BOTTOM)this.newPage();}
  text(text,{x=M,size=9,bold=false,maxWidth=CONTENT_W,lineHeight=null,gap=0}={}){
    const lh=lineHeight||size*1.32; const lines=wrap(text,size,maxWidth);
    for(const ln of lines){
      if(this.y-lh<BOTTOM)this.newPage();
      this.add(textCmd(ln,x,this.y,size,bold));this.y-=lh;
    }
    if(gap){if(this.y-gap<BOTTOM)this.newPage();else this.y-=gap;}
  }
  section(title){this.ensure(30);this.y-=5;this.add(textCmd(title,M,this.y,12,true));this.y-=6;this.add(lineCmd(M,this.y,PAGE_W-M,this.y,.8));this.y-=10;}
  table(headers,rows,widths,{fontSize=8,firstBold=false,headerFontSize=null}={}){
    const x0=M; const hfs=headerFontSize||fontSize; const headerH=24;
    const rowHeights=rows.map(row=>{
      let maxLines=1;
      row.forEach((cell,i)=>{maxLines=Math.max(maxLines,wrap(String(cell??''),fontSize,Math.max(8,widths[i]-10)).length);});
      return Math.max(20,maxLines*(fontSize*1.28)+8);
    });
    const drawHeader=()=>{
      this.ensure(headerH+20);
      let x=x0; this.add(rectCmd(x0,this.y-headerH,widths.reduce((a,b)=>a+b,0),headerH,.65));
      headers.forEach((h,i)=>{
        if(i>0)this.add(lineCmd(x,this.y,x,this.y-headerH,.5));
        const lines=wrap(h,hfs,Math.max(8,widths[i]-8));let ty=this.y-9;
        for(const ln of lines.slice(0,3)){this.add(textCmd(ln,x+4,ty,hfs,true));ty-=hfs*1.08;}
        x+=widths[i];
      });
      this.y-=headerH;
    };
    drawHeader();
    rows.forEach((row,ri)=>{
      const rh=rowHeights[ri]; if(this.y-rh<BOTTOM){this.newPage();drawHeader();}
      let x=x0; const total=widths.reduce((a,b)=>a+b,0); this.add(rectCmd(x0,this.y-rh,total,rh,.5));
      row.forEach((cell,i)=>{
        if(i>0)this.add(lineCmd(x,this.y,x,this.y-rh,.4));
        const lines=wrap(String(cell??''),fontSize,Math.max(8,widths[i]-10));let ty=this.y-12;
        for(const ln of lines){this.add(textCmd(ln,x+4,ty,fontSize,firstBold&&i===0));ty-=fontSize*1.2;}
        x+=widths[i];
      });
      this.y-=rh;
    });
    this.y-=8;
  }
}

function buildPdfBytes(report){
  const p=new ReportPainter();
  p.text('GROWTH PRACTICE | WEEKLY REVIEW',{size:17,bold:true,lineHeight:21});
  p.text(report.range+'  |  '+(report.curriculum||'Weekly practice'),{size:10,gap:10});
  p.text('Self-reported practice and events. Blank means not entered, not zero.',{size:8.3,gap:4});
  p.text('Created locally. PDF is unencrypted; review before sharing.',{size:8.3,gap:8});
  p.section('Seven-day snapshot');
  p.table(['Day','Mindfulness','Rehearsal','Opportunity','Entry'],report.overview,[76,110,112,112,126],{fontSize:8.7});
  p.section('Learning activities');
  for(const r of report.learning)p.text((r.done?'[x] ':'[ ] ')+r.title,{size:9.5,lineHeight:14,gap:2});
  p.section('Daily observations');
  if(!report.days.length)p.text('No daily observations have been recorded.',{size:9.4,gap:4});
  for(const d of report.days){
    p.ensure(42);p.text(d.date+(d.flag?'  [Contains review flag]':''),{size:11,bold:true,lineHeight:16,gap:2});
    p.text('Mindfulness: '+d.mindfulness+'  |  Rehearsal: '+d.rehearsal,{size:9,lineHeight:12,gap:1});
    p.text('Relevant opportunity: '+d.opportunity,{size:9,lineHeight:12,gap:3});
    if(!d.events.length)p.text('No separate events recorded.',{size:8.7,gap:3});
    for(const ev of d.events){
      p.ensure(45);p.text(ev.title+(ev.flag?'  [For Monday review]':''),{size:9.7,bold:true,lineHeight:13,gap:1});
      if(ev.recognition!=='-')p.text('Recognition: '+ev.recognition,{size:8.6,lineHeight:11});
      if(ev.actions)p.text('Actions: '+ev.actions,{size:8.6,lineHeight:11});
      if(ev.facts)p.text('Observed: '+ev.facts,{size:8.6,lineHeight:11});
      if(ev.emotions)p.text('Feelings/cues: '+ev.emotions,{size:8.6,lineHeight:11});
      if(ev.interpretations)p.text('Interpretations: '+ev.interpretations,{size:8.6,lineHeight:11});
      p.y-=5;
    }
    p.y-=6;
  }
  p.section('Review notes');
  p.text(report.notes||'No weekly notes entered.',{size:9.3,maxWidth:CONTENT_W,lineHeight:13,gap:7});
  while(p.pages.length>1 && p.pages[p.pages.length-1].length===0)p.pages.pop();
  return makePdf(p.pages);
}
function makePdf(pages){
  const objects=[];
  const addObj=(num,body)=>objects.push({num,body});
  addObj(1,'<< /Type /Catalog /Pages 2 0 R >>');
  const pageNums=pages.map((_,i)=>5+i*2);
  addObj(2,`<< /Type /Pages /Kids [${pageNums.map(n=>`${n} 0 R`).join(' ')}] /Count ${pages.length} >>`);
  addObj(3,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  addObj(4,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  pages.forEach((cmds,i)=>{
    const pageNum=5+i*2, contentNum=pageNum+1; const stream=cmds.join(''); const len=new TextEncoder().encode(stream).length;
    addObj(pageNum,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNum} 0 R >>`);
    addObj(contentNum,`<< /Length ${len} >>\nstream\n${stream}endstream`);
  });
  objects.sort((a,b)=>a.num-b.num);
  let pdf='%PDF-1.4\n%GROWTHPRACTICE\n'; const offsets=[0];
  for(const obj of objects){offsets[obj.num]=new TextEncoder().encode(pdf).length;pdf+=`${obj.num} 0 obj\n${obj.body}\nendobj\n`;}
  const xref=new TextEncoder().encode(pdf).length; const max=Math.max(...objects.map(o=>o.num));
  pdf+=`xref\n0 ${max+1}\n0000000000 65535 f \n`;
  for(let i=1;i<=max;i++){pdf+=`${String(offsets[i]||0).padStart(10,'0')} 00000 n \n`;}
  pdf+=`trailer\n<< /Size ${max+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}

const api={buildPdfBytes};if(typeof module!=='undefined'&&module.exports)module.exports=api;if(global)global.GrowthPDF=api;
})(typeof window!=='undefined'?window:globalThis);
