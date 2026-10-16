'use strict';
// Weeks 2-4 are provisional previews; the latest Monday Training Brief controls live assignments.
const GP_CONTENT={
 version:'1.0.5',
 startMonday:'2026-10-19',
 week1:{
  number:1,title:'Interrupting automatic defensiveness',subtitle:'Standard DBT STOP · Missing-Links Analysis · Fruzzetti Chapter 3',
  status:'Assigned for initial learning; completion is user-controlled.',
  goal:'Learn to notice a defensive response after it begins, interrupt the next escalation, and choose a response without having to settle the disagreement immediately.',
  rehearsalTitle:'STOP: catch → pause → breathe → choose',
  rehearsalHow:'While calm, imagine an unfair accusation. Notice the urge to explain, stop the next sentence, take two comfortable breaths, then choose a respectful next action. Rehearse for 2–5 minutes.',
  resources:[
   {id:'linehan-stop',type:'Primary reading',title:'Linehan — STOP',detail:'DBT Skills Training Handouts and Worksheets, 2nd ed., Distress Tolerance Handout 4, printed p. 327 (PDF p. 351).',explanation:'STOP means Stop, Take a step back, Observe, Proceed mindfully. It prevents impulsive escalation; pausing does not equal agreeing or leaving.'},
   {id:'linehan-ml',type:'Primary reading',title:'Linehan — Missing-Links Analysis',detail:'General Handouts 6 and 8, printed pp. 19 and 23 (PDF pp. 43 and 47). Worksheet 3 (p. 38) is optional when relevant.',explanation:'Use when a particular intended effective behavior was not done. Check whether you knew how, remembered, wanted to, or met an obstacle—without assuming why.'},
   {id:'fruzzetti',type:'Primary reading',title:'Fruzzetti — How to Stop Making Things Worse',detail:'The High-Conflict Couple, Chapter 3, printed pp. 29–38 (PDF pp. 42–51).',explanation:'Practice preventing additional harm before attempting repair or resolution. The user-specific remaining-engaged example is our custom application, not an official step.'},
   {id:'deepdive',type:'ChatGPT session',title:'Tuesday deep dive · Week 1',detail:'Use a new Skills Training chat in this Project. Read the assigned pages and request the full teaching explanation; do not mark this complete until you actually study it.',explanation:'A guided, source-grounded lesson in ChatGPT is separate from rehearsal. It will not launch automatically from this app.'},
   {id:'video',type:'Video',title:'Dr. Jennifer May — STOP skills',detail:'Supplementary video; internet required. The original video itself has not been independently verified as available.',url:'https://www.youtube.com/watch?v=Od9GaNk9Clk',explanation:'Use this as an additional explanation of STOP, checking the primary Linehan handout if there is a difference.'},
   {id:'emotion',type:'Optional',title:'Atlas of the Heart — emotion vocabulary',detail:'Use your copy to distinguish guilt, shame, embarrassment and humiliation. Optional 10–15 minute weekly review.',explanation:'Do not force an emotion label during high-intensity conflict if you do not know it.'}
  ],
  rehearsals:[
   {title:'A · A statement feels unfair',text:'Someone says “You never listen.” You already began explaining. Practice stopping the next rebuttal without requiring immediate agreement.'},
   {title:'B · A missed commitment',text:'Someone points out a task you did not finish. Practice pausing, stating what did occur, and responding without a long defensive explanation.'},
   {title:'C · High activation',text:'In a fictional intense disagreement, practice not retaliating while remaining present if possible. A necessary safety boundary or break remains available.'}
  ]
 },
 week2:{
  number:2,title:'ACT Choice Point and defusion',subtitle:'ACT · Noticing, naming, and reorienting attention',status:'Proposed next lesson — confirm during Monday review.',
  goal:'Spot a difficult thought or urge and choose a next action consistent with your values, without needing to eliminate the feeling or settle the thought.',
  rehearsalTitle:'Notice → name → return to choice',rehearsalHow:'Take one mild fictional trigger. Label “I am having the thought that…” or simply “defending urge,” then choose a small useful response. Do not force internal labels.',
  resources:[
   {id:'act-choice',type:'Primary reading',title:'Russ Harris — ACT Choice Point',detail:'Read the Choice Point and values-directed action material in ACT with Love or Learning ACT. Confirm exact pages in your edition.',explanation:'A choice point compares automatic moves that take us away from values with workable moves toward values; difficult feelings may remain.'},
   {id:'act-defusion',type:'Primary reading',title:'ACT — Defusion and willingness',detail:'Targeted defusion/present-moment sections in Learning ACT or Get Out of Your Mind and Into Your Life; page range to assign in Tuesday session.',explanation:'Notice thoughts as thoughts rather than commands; willingness means allowing difficult experience while choosing action.'},
   {id:'deepdive',type:'ChatGPT session',title:'Tuesday deep dive · Week 2',detail:'Request a source-grounded ACT Choice Point and defusion lesson before rehearsing.',explanation:'This is education, not automatic practice.'}
  ],
  rehearsals:[{title:'A · The urge to correct',text:'A coworker or partner makes a disputed claim. Notice the urge to correct and rehearse choosing the next response.'},{title:'B · Important uncertainty',text:'A conversation stays unresolved. Rehearse making one values-consistent move without demanding certainty.'}]
 },
 week3:{
  number:3,title:'Attention, listening and perspective-taking',subtitle:'Standard DBT Mindfulness of Others · ACT attention · Fruzzetti',status:'Proposed — adjust after Week 2 review.',
  goal:'Return attention to another person and the current exchange instead of automatically preparing your next explanation. Understanding does not equal agreeing.',
  rehearsalTitle:'Return attention to the other person',rehearsalHow:'Use a mild scenario. Notice preparing a rebuttal. Redirect to the actual words and concern; identify one thing you understood, without parroting a therapy script.',
  resources:[
   {id:'mindfulness-others',type:'Primary reading',title:'Linehan — Mindfulness of Others',detail:'Read the relevant interpersonal mindfulness handout in DBT Skills Training Handouts and Worksheets; verify page in Tuesday lesson.',explanation:'Notice and participate attentively in interaction, returning from internal distraction.'},
   {id:'fru-attention',type:'Primary reading',title:'Fruzzetti — attentive relationship responding',detail:'Target a relevant listening/attention section of The High-Conflict Couple; select an exact chapter in Tuesday session.',explanation:'Attention and understanding come before effective relational responses; this does not require adopting another person’s interpretation.'},
   {id:'deepdive',type:'ChatGPT session',title:'Tuesday deep dive · Week 3',detail:'Request the full attention/listening lesson before guided exercises.',explanation:'This is education, not automatic practice.'}
  ],
  rehearsals:[{title:'A · Pause the inner rebuttal',text:'During a fictional complaint, notice constructing your reply and return attention to the concern.'},{title:'B · Listen and maintain a boundary',text:'Hear a person’s experience while not adopting their assumed account of your intentions.'}]
 },
 week4:{
  number:4,title:'Validation and compassionate presence',subtitle:'Fruzzetti · Love/Stosny · respectful disagreement',status:'Proposed — adjust after Week 3 review.',
  goal:'Practice acknowledging what is understandable or observable in another person’s experience without agreeing with inaccurate accusations or surrendering self-respect.',
  rehearsalTitle:'Understand impact without conceding facts',rehearsalHow:'In a fictional disagreement, identify one specific feeling, event or impact you can genuinely acknowledge, and practice a concise non-scripted response.',
  resources:[
   {id:'fru-validate',type:'Primary reading',title:'Fruzzetti — validation',detail:'Choose and read the relevant validation material from The High-Conflict Couple in the Tuesday learning session.',explanation:'Validation can communicate understanding even while important factual disagreements remain.'},
   {id:'stosny-presence',type:'Primary reading',title:'Love and Stosny — compassionate connection',detail:'Targeted selection from How to Improve Your Marriage Without Talking About It; verify and contextualize in the learning session.',explanation:'Explore compassionate presence as one possibility, without assuming gender-generalizations or obligatory appeasement.'},
   {id:'deepdive',type:'ChatGPT session',title:'Tuesday deep dive · Week 4',detail:'Review source distinctions, then rehearse after education is complete.',explanation:'This is education, not automatic practice.'}
  ],
  rehearsals:[{title:'A · Acknowledge impact',text:'A complaint contains a real effect and a disputed motive. Rehearse acknowledging the effect without agreeing with the motive.'},{title:'B · Brief and genuine',text:'Practice a short response that sounds natural rather than using formulaic therapeutic phrases.'}]
 }
};
for(let n=5;n<=8;n++) GP_CONTENT['week'+n]={number:n,title:n<=6?'Adaptive skill focus':'Consolidation and generalization',subtitle:'Not assigned yet',status:'Open planning slot — decide at an earlier Monday review.',goal:'Content will be selected from observations and prior learning, not automatically filled as a prescribed therapy course.',rehearsalTitle:'No rehearsal assigned yet',rehearsalHow:'Wait for a learning assignment; you can still record daily mindfulness and events.',resources:[],rehearsals:[]};
GP_CONTENT.week1.tuesdayPrompt='Skills Training — Week 1 of my Integrated Personal Growth Program. Teach standard DBT STOP (Linehan Distress Tolerance Handout 4) and Missing-Links Analysis (General Handout 8), plus Fruzzetti The High-Conflict Couple Chapter 3. Use sources in my DBT/RO-DBT/ACT Project. Start with education: rationale, instructions, specific readings, misunderstandings and realistic examples. Do not begin guided rehearsal until I explicitly say I am ready. Keep this separate from my RO Journal. Ask one question at a time when practice begins.';
GP_CONTENT.week1.mondayPrompt='Monday Personal Growth Review — Week 1. I will paste my weekly app report separately. Please review my actual entries, separate observation and inference, then choose a behavior chain/solution analysis for an unwanted behavior, a Missing-Links Analysis for an intended behavior that did not happen, or neither when appropriate. Ask one question at a time. Help set Week 2 training based on real evidence; do not infer a completed skill because I opened a resource.';
