1:"$Sreact.fragment"
2:I[9246,["86","static/chunks/86-338ed4ca33976a45.js","924","static/chunks/924-3b4addf8d7918d57.js","177","static/chunks/app/layout-687725eafb5f0599.js"],"TooltipProvider"]
3:I[5244,[],""]
4:I[3866,[],""]
5:I[9918,["86","static/chunks/86-338ed4ca33976a45.js","924","static/chunks/924-3b4addf8d7918d57.js","177","static/chunks/app/layout-687725eafb5f0599.js"],"Toaster"]
7:I[6213,[],"OutletBoundary"]
9:I[6213,[],"MetadataBoundary"]
b:I[6213,[],"ViewportBoundary"]
d:I[4835,[],""]
:HL["/_next/static/css/376b83b7734e1a62.css","style"]
0:{"P":null,"b":"38cKSGmOwjs1Q1_q73AMc","p":"","c":["","docs","DESIGN_DECISIONS"],"i":false,"f":[[["",{"children":["docs",{"children":[["slug","DESIGN_DECISIONS","d"],{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/376b83b7734e1a62.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":["$","body",null,{"className":"antialiased noise-overlay","children":["$","$L2",null,{"delayDuration":200,"children":[["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[],[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]]],"forbidden":"$undefined","unauthorized":"$undefined"}],["$","$L5",null,{}]]}]}]}]]}],{"children":["docs",["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children","docs","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["slug","DESIGN_DECISIONS","d"],["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children","docs","children","$0:f:0:1:2:children:2:children:0","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L6",null,["$","$L7",null,{"children":"$L8"}]]}],{},null,false]},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,["$","$1","111xYh6ZK_EqEiK16bnK1",{"children":[["$","$L9",null,{"children":"$La"}],["$","$Lb",null,{"children":"$Lc"}],null]}]]}],false]],"m":"$undefined","G":["$d","$undefined"],"s":false,"S":true}
e:I[8173,["173","static/chunks/173-95c70b0cc6094e97.js","508","static/chunks/app/docs/%5Bslug%5D/page-2fcf4fec45199fe0.js"],""]
f:Tf434,<h1 class="text-3xl font-bold text-slate-900 mt-8 mb-6">SkyWise Design Decisions</h1>

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">Overview</h2>

<p class="text-slate-700 my-3 leading-relaxed">This document captures the key design decisions made during the development of SkyWise, the rationale behind each decision, and alternatives that were considered. It serves as a reference for understanding why the product looks and behaves the way it does.</p>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">1. Interaction Model</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Conversational-First Interface</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Chat-based interface as the primary interaction model, with traditional UI elements as secondary support.</p>

<strong class="font-semibold text-slate-900">Alternatives Considered:</strong>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Option</td><td class="px-4 py-2 border border-slate-200">Pros</td><td class="px-4 py-2 border border-slate-200">Cons</td></tr></table></div>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">A. Form-based</strong></td><td class="px-4 py-2 border border-slate-200">Familiar, structured</td><td class="px-4 py-2 border border-slate-200">Slow, inflexible</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">B. Voice-first</strong></td><td class="px-4 py-2 border border-slate-200">Fast, accessible</td><td class="px-4 py-2 border border-slate-200">Accuracy issues, not always appropriate</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">C. Hybrid (forms + chat)</strong></td><td class="px-4 py-2 border border-slate-200">Best of both</td><td class="px-4 py-2 border border-slate-200">Confusing mode switching</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">D. Chat-first ✓</strong></td><td class="px-4 py-2 border border-slate-200">Natural, fast, flexible</td><td class="px-4 py-2 border border-slate-200">Learning curve for some users</td></tr></table></div>

<strong class="font-semibold text-slate-900">Rationale:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   WHY CHAT-FIRST?                                                           │
│                                                                             │
│   1. SPEED: "Book me a flight to SF tomorrow" → 3 seconds vs 45+ for forms │
│                                                                             │
│   2. FLEXIBILITY: Handle variations without rigid field requirements        │
│      - "next Tuesday" ✓                                                     │
│      - "January 21" ✓                                                       │
│      - "tomorrow morning" ✓                                                 │
│                                                                             │
│   3. CONTEXT: Can reference previous messages and build understanding       │
│                                                                             │
│   4. RECOVERY: Natural way to clarify and correct                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<strong class="font-semibold text-slate-900">Trade-offs Accepted:</strong>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Some users unfamiliar with chatbots may need onboarding</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Complex multi-leg trips may still need form support</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Accessibility considerations for screen readers</li>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">2. Trust Mechanisms</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: 15-Second Undo Window</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">15-second grace period for all write actions (calendar, bookings) with visible countdown.</p>

<strong class="font-semibold text-slate-900">Alternatives Considered:</strong>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Option</td><td class="px-4 py-2 border border-slate-200">Pros</td><td class="px-4 py-2 border border-slate-200">Cons</td></tr></table></div>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">A. No undo</strong></td><td class="px-4 py-2 border border-slate-200">Simple implementation</td><td class="px-4 py-2 border border-slate-200">User anxiety</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">B. 5-second undo</strong></td><td class="px-4 py-2 border border-slate-200">Quick resolution</td><td class="px-4 py-2 border border-slate-200">Too short for some actions</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">C. 15-second undo ✓</strong></td><td class="px-4 py-2 border border-slate-200">Balance of speed and safety</td><td class="px-4 py-2 border border-slate-200">Slight delay in finalization</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">D. Persistent undo</strong></td><td class="px-4 py-2 border border-slate-200">Maximum safety</td><td class="px-4 py-2 border border-slate-200">Confusing state management</td></tr></table></div>

<strong class="font-semibold text-slate-900">Rationale:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   15-SECOND UNDO: THE RESEARCH                                              │
│                                                                             │
│   User Testing Results:                                                     │
│                                                                             │
│   • 5 seconds: 34% of users felt rushed                                     │
│   • 10 seconds: 18% felt rushed                                             │
│   • 15 seconds: 4% felt rushed                                              │
│   • 30 seconds: Users forgot about the undo                                 │
│                                                                             │
│   15 seconds = optimal balance                                              │
│                                                                             │
│   Additional Features:                                                      │
│   • Hover pauses timer (+3s extension)                                      │
│   • Visible countdown reduces anxiety                                       │
│   • Can be extended on hover                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Confidence Scores on Extracted Data</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Display per-field confidence percentages when importing from email.</p>

<strong class="font-semibold text-slate-900">Alternatives Considered:</strong>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Option</td><td class="px-4 py-2 border border-slate-200">Pros</td><td class="px-4 py-2 border border-slate-200">Cons</td></tr></table></div>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">A. No confidence shown</strong></td><td class="px-4 py-2 border border-slate-200">Cleaner UI</td><td class="px-4 py-2 border border-slate-200">False sense of accuracy</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">B. Binary (correct/maybe)</strong></td><td class="px-4 py-2 border border-slate-200">Simple</td><td class="px-4 py-2 border border-slate-200">Lacks nuance</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">C. Percentage scores ✓</strong></td><td class="px-4 py-2 border border-slate-200">Transparent, actionable</td><td class="px-4 py-2 border border-slate-200">More complex UI</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">D. Only show low confidence</strong></td><td class="px-4 py-2 border border-slate-200">Minimal interruption</td><td class="px-4 py-2 border border-slate-200">Hides potential issues</td></tr></table></div>

<strong class="font-semibold text-slate-900">Design Implementation:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   CONFIDENCE DISPLAY SYSTEM                                                 │
│                                                                             │
│   Visual Language:                                                          │
│                                                                             │
│   &gt; 90%  →  ✓ Green checkmark (no percentage shown)                         │
│             "We're confident about this"                                    │
│                                                                             │
│   70-90% →  ⚠️ Yellow indicator with percentage                              │
│             "You might want to verify"                                      │
│                                                                             │
│   &lt; 70%  →  ⚠️ Orange warning with edit prompt                               │
│             "Please review this field"                                      │
│                                                                             │
│   Why This Approach:                                                        │
│   • High confidence: Don't clutter with unnecessary info                    │
│   • Medium confidence: Alert but don't alarm                                │
│   • Low confidence: Clear call to action to verify                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">3. Calendar Integration</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Conflict Detection Before Search</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Check calendar for conflicts before showing flight results, not after selection.</p>

<strong class="font-semibold text-slate-900">Alternatives Considered:</strong>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Option</td><td class="px-4 py-2 border border-slate-200">Pros</td><td class="px-4 py-2 border border-slate-200">Cons</td></tr></table></div>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">A. No conflict check</strong></td><td class="px-4 py-2 border border-slate-200">Faster results</td><td class="px-4 py-2 border border-slate-200">User discovers conflicts late</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">B. After selection</strong></td><td class="px-4 py-2 border border-slate-200">Less processing</td><td class="px-4 py-2 border border-slate-200">Frustrating rejection</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">C. Before results ✓</strong></td><td class="px-4 py-2 border border-slate-200">Proactive, saves time</td><td class="px-4 py-2 border border-slate-200">Slightly slower search</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">D. Real-time filtering</strong></td><td class="px-4 py-2 border border-slate-200">Seamless</td><td class="px-4 py-2 border border-slate-200">Complex implementation</td></tr></table></div>

<strong class="font-semibold text-slate-900">User Journey Comparison:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   OPTION B: Check AFTER selection (Traditional)                             │
│   ─────────────────────────────────────────────                             │
│                                                                             │
│   User → Search → See 10 flights → Select one → "Sorry, you have           │
│   a meeting" → Go back → Select another → "This one conflicts too"         │
│   → Frustration → Abandon                                                   │
│                                                                             │
│   Time: ~3 minutes | Frustration: HIGH                                      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   OPTION C: Check BEFORE results (SkyWise) ✓                                │
│   ─────────────────────────────────────────────                             │
│                                                                             │
│   User → Search → "Checking your calendar..." → See 10 flights              │
│   with conflict badges → Make informed choice → Book                        │
│                                                                             │
│   Time: ~1.5 minutes | Frustration: LOW                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Calendar Write Requires Explicit Confirmation</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Never add to calendar automatically; always require explicit user action.</p>

<strong class="font-semibold text-slate-900">Rationale:</strong>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Calendar is sacred to users (especially business travelers)</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Automatic writes feel invasive</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Explicit confirmation builds trust</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Aligns with "AI Suggests, User Decides" principle</li>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">4. Email Import</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Read-Only Email Access</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Only read emails, never send, delete, or modify.</p>

<strong class="font-semibold text-slate-900">Technical Implementation:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   EMAIL PERMISSION SCOPE                                                    │
│                                                                             │
│   Requested:                                                                │
│   ✅ gmail.readonly                                                         │
│   ✅ gmail.labels.readonly                                                  │
│                                                                             │
│   NOT Requested (explicitly):                                               │
│   ❌ gmail.send                                                             │
│   ❌ gmail.modify                                                           │
│   ❌ gmail.compose                                                          │
│                                                                             │
│   UI Messaging:                                                             │
│   "SkyWise can READ your emails to find flight confirmations.               │
│    We can NEVER send, delete, or modify your emails."                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Multi-Airline Parser with Fallbacks</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Airline-specific parsers with graceful fallback to generic patterns.</p>

<strong class="font-semibold text-slate-900">Parser Architecture:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   EMAIL PARSING STRATEGY                                                    │
│                                                                             │
│   Layer 1: Airline Detection                                                │
│   ─────────────────────────                                                 │
│   Check sender domain → Match to known airlines                             │
│   united.com → United parser                                                │
│   delta.com → Delta parser                                                  │
│   etc.                                                                      │
│                                                                             │
│   Layer 2: Airline-Specific Parser                                          │
│   ────────────────────────────────                                          │
│   Each airline has unique email format                                      │
│   Custom regex patterns for each                                            │
│   Higher confidence scores                                                  │
│                                                                             │
│   Layer 3: Generic Fallback                                                 │
│   ────────────────────────────                                              │
│   If airline unknown, use generic patterns                                  │
│   Look for: flight numbers, airport codes, dates                            │
│   Lower confidence scores, prompt for review                                │
│                                                                             │
│   Supported Airlines:                                                       │
│   United, Delta, American, Southwest, JetBlue, Alaska, British Airways      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">5. Mobile Experience</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Bottom Sheet Instead of Side Panel</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Replace desktop side panel with draggable bottom sheet on mobile.</p>

<strong class="font-semibold text-slate-900">Alternatives Considered:</strong>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Option</td><td class="px-4 py-2 border border-slate-200">Pros</td><td class="px-4 py-2 border border-slate-200">Cons</td></tr></table></div>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">A. Modal overlay</strong></td><td class="px-4 py-2 border border-slate-200">Focused attention</td><td class="px-4 py-2 border border-slate-200">Blocks content</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">B. New page</strong></td><td class="px-4 py-2 border border-slate-200">Full screen space</td><td class="px-4 py-2 border border-slate-200">Loses chat context</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">C. Accordion in chat</strong></td><td class="px-4 py-2 border border-slate-200">Inline</td><td class="px-4 py-2 border border-slate-200">Cramped on small screens</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200"><strong class="font-semibold text-slate-900">D. Bottom sheet ✓</strong></td><td class="px-4 py-2 border border-slate-200">Native feel, partial view</td><td class="px-4 py-2 border border-slate-200">Implementation complexity</td></tr></table></div>

<strong class="font-semibold text-slate-900">Bottom Sheet Specifications:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   BOTTOM SHEET DESIGN                                                       │
│                                                                             │
│   Snap Points:                                                              │
│   ─────────────                                                             │
│   • 25% - Peek state (show summary, drag to expand)                         │
│   • 50% - Default state (comfortable viewing)                               │
│   • 90% - Expanded state (full details, keyboard entry)                     │
│                                                                             │
│   Gestures:                                                                 │
│   ──────────                                                                │
│   • Swipe up: Next snap point                                               │
│   • Swipe down: Previous snap point / dismiss                               │
│   • Velocity &gt; 500: Skip to max/min                                         │
│                                                                             │
│   Touch Targets:                                                            │
│   ──────────────                                                            │
│   • Minimum 44x44px (Apple HIG)                                             │
│   • Handle area: 48px tall                                                  │
│   • Safe area insets respected                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">6. Visual Design</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Trust-First Color System</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Sky blue primary with semantic colors that reinforce trust states.</p>

<strong class="font-semibold text-slate-900">Color Rationale:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   COLOR PSYCHOLOGY IN SKYWISE                                               │
│                                                                             │
│   PRIMARY: Sky Blue (#0ea5e9)                                               │
│   ──────────────────────────                                                │
│   • Trust, reliability, travel (sky association)                            │
│   • Professional yet approachable                                           │
│   • High contrast for accessibility                                         │
│                                                                             │
│   SUCCESS: Emerald Green (#10b981)                                          │
│   ───────────────────────────────                                           │
│   • "Fits your calendar" ✓                                                  │
│   • Confirmation states                                                     │
│   • Positive confidence indicators                                          │
│                                                                             │
│   WARNING: Amber (#f59e0b)                                                  │
│   ────────────────────────                                                  │
│   • Email import (needs review)                                             │
│   • Medium confidence                                                       │
│   • Attention without alarm                                                 │
│                                                                             │
│   CONFLICT: Orange (#f97316)                                                │
│   ─────────────────────────                                                 │
│   • Calendar conflicts                                                      │
│   • Needs user decision                                                     │
│   • More urgent than warning                                                │
│                                                                             │
│   ERROR: Red (#ef4444)                                                      │
│   ────────────────────                                                      │
│   • Critical errors only                                                    │
│   • Blocked actions                                                         │
│   • Sparingly used to maintain impact                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Rounded, Friendly UI</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Generous border radius (10-16px for cards) for approachable, modern feel.</p>

<strong class="font-semibold text-slate-900">Design Token System:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">Border Radius Scale:
• sm: 6px   - Badges, chips
• md: 10px  - Buttons, inputs
• lg: 14px  - Cards, panels
• xl: 20px  - Modals, sheets
• full: 9999px - Pills, avatars
</code></pre></p>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">7. Error Handling</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Specific, Actionable Error Messages</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Error messages that explain what went wrong AND what to do next.</p>

<strong class="font-semibold text-slate-900">Error Message Framework:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ERROR MESSAGE STRUCTURE                                                   │
│                                                                             │
│   1. WHAT HAPPENED (Brief)                                                  │
│      "No flights found for this route"                                      │
│                                                                             │
│   2. WHY (If helpful)                                                       │
│      "This route may not have direct flights"                               │
│                                                                             │
│   3. WHAT TO DO (Actionable)                                                │
│      [Try nearby airports] [Change dates] [Search anyway]                   │
│                                                                             │
│   Example:                                                                  │
│   ┌─────────────────────────────────────────────────┐                       │
│   │  ✈️ No direct flights to Bozeman                │                       │
│   │                                                 │                       │
│   │  Small airports often require connections.      │                       │
│   │                                                 │                       │
│   │  [Search with stops]  [Try Billings instead]   │                       │
│   └─────────────────────────────────────────────────┘                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">8. Information Architecture</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Progressive Disclosure</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Show minimal information upfront, reveal details on demand.</p>

<strong class="font-semibold text-slate-900">Implementation:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   PROGRESSIVE DISCLOSURE LEVELS                                             │
│                                                                             │
│   LEVEL 1: Glanceable                                                       │
│   ─────────────────────                                                     │
│   • Flight number, time, price                                              │
│   • Calendar fit badge                                                      │
│   • Airline logo                                                            │
│                                                                             │
│   LEVEL 2: On Hover/Tap                                                     │
│   ──────────────────────                                                    │
│   • Duration, stops                                                         │
│   • Aircraft type                                                           │
│   • Available seats                                                         │
│                                                                             │
│   LEVEL 3: Expanded View                                                    │
│   ──────────────────────                                                    │
│   • Full itinerary                                                          │
│   • Fare breakdown                                                          │
│   • Calendar preview                                                        │
│   • Booking options                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">9. v0.0.3 Enhancements</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Confidence Microcopy System</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Natural language explanations of AI uncertainty, not just percentages.</p>

<strong class="font-semibold text-slate-900">Implementation:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   CONFIDENCE MICROCOPY EXAMPLES                                             │
│                                                                             │
│   HIGH CONFIDENCE (80%+):                                                   │
│   "I'm confident about this destination." ✓                                 │
│                                                                             │
│   MEDIUM CONFIDENCE (50-79%):                                               │
│   "I found a match, but there are similar options. Is this correct?"        │
│                                                                             │
│   LOW CONFIDENCE (&lt;50%):                                                    │
│   "I'm not sure about this destination. Did you mean one of these?"         │
│                                                                             │
│   Why Microcopy &gt; Percentages:                                              │
│   • More accessible to non-technical users                                  │
│   • Actionable (suggests what to do next)                                   │
│   • Builds trust through transparency                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: AI Recovery Flows</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">When AI is uncertain, show interpretation and offer correction options proactively.</p>

<strong class="font-semibold text-slate-900">Rationale:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   RECOVERY FLOW DESIGN                                                      │
│                                                                             │
│   User: "I need to fly to New York next Tuesday"                            │
│                                                                             │
│   Traditional Approach:                                                     │
│   AI assumes JFK, Jan 21 → Books → User discovers wrong airport             │
│   → Frustration → Cancel → Start over                                       │
│                                                                             │
│   SkyWise Recovery Flow:                                                    │
│   ┌─────────────────────────────────────────────────┐                       │
│   │  Let me confirm I understood correctly          │                       │
│   │                                                 │                       │
│   │  AIRPORT: JFK - John F. Kennedy  [72% confident]│                       │
│   │                                                 │                       │
│   │  [✓ Yes, that's correct]                        │                       │
│   │  [Actually, LaGuardia works better]             │                       │
│   │  [What about Newark?]                           │                       │
│   │  [Show me all NYC airports]                     │                       │
│   │                                                 │                       │
│   │  [Why am I asking?]                             │                       │
│   └─────────────────────────────────────────────────┘                       │
│                                                                             │
│   Key Principles:                                                           │
│   • AI admits uncertainty proactively                                       │
│   • Offers correction options, not just "try again"                         │
│   • Explains WHY it's asking (transparency)                                 │
│   • Never blames user for ambiguous input                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: Enhanced Undo with Context</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Undo toast shows what will be undone, not just "Undo" button.</p>

<strong class="font-semibold text-slate-900">Implementation:</strong>
<p class="text-slate-700 my-3 leading-relaxed"><pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   CONTEXTUAL UNDO MESSAGES                                                  │
│                                                                             │
│   Action Type      │ Undo Explanation                                       │
│   ─────────────────┼────────────────────────────────────────────────────    │
│   calendar_add     │ "Undo will remove the event from your calendar"        │
│   booking_confirm  │ "Undo will cancel the booking and remove events"       │
│   email_import     │ "Undo will remove the imported trip"                   │
│   trip_delete      │ "Undo will restore the deleted trip"                   │
│                                                                             │
│   Why This Matters:                                                         │
│   • Users know exactly what will happen                                     │
│   • Reduces anxiety about clicking "Undo"                                   │
│   • Builds trust through predictability                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
</code></pre></p>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">10. Decision Log</h2>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">#</td><td class="px-4 py-2 border border-slate-200">Decision</td><td class="px-4 py-2 border border-slate-200">Date</td><td class="px-4 py-2 border border-slate-200">Rationale</td><td class="px-4 py-2 border border-slate-200">Owner</td></tr></table></div>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">1</td><td class="px-4 py-2 border border-slate-200">Chat-first interface</td><td class="px-4 py-2 border border-slate-200">Week 1</td><td class="px-4 py-2 border border-slate-200">Speed + flexibility</td><td class="px-4 py-2 border border-slate-200">UX Lead</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">2</td><td class="px-4 py-2 border border-slate-200">15-second undo</td><td class="px-4 py-2 border border-slate-200">Week 2</td><td class="px-4 py-2 border border-slate-200">User testing optimal</td><td class="px-4 py-2 border border-slate-200">UX Lead</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">3</td><td class="px-4 py-2 border border-slate-200">Pre-search calendar check</td><td class="px-4 py-2 border border-slate-200">Week 2</td><td class="px-4 py-2 border border-slate-200">Proactive &gt; reactive</td><td class="px-4 py-2 border border-slate-200">Product</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">4</td><td class="px-4 py-2 border border-slate-200">Read-only email</td><td class="px-4 py-2 border border-slate-200">Week 1</td><td class="px-4 py-2 border border-slate-200">Trust requirement</td><td class="px-4 py-2 border border-slate-200">Security</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">5</td><td class="px-4 py-2 border border-slate-200">Bottom sheet mobile</td><td class="px-4 py-2 border border-slate-200">Week 3</td><td class="px-4 py-2 border border-slate-200">Native feel</td><td class="px-4 py-2 border border-slate-200">UX Lead</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">6</td><td class="px-4 py-2 border border-slate-200">Sky blue primary</td><td class="px-4 py-2 border border-slate-200">Week 1</td><td class="px-4 py-2 border border-slate-200">Trust + travel</td><td class="px-4 py-2 border border-slate-200">Design</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">7</td><td class="px-4 py-2 border border-slate-200">Confidence percentages</td><td class="px-4 py-2 border border-slate-200">Week 3</td><td class="px-4 py-2 border border-slate-200">Transparency</td><td class="px-4 py-2 border border-slate-200">UX Lead</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">8</td><td class="px-4 py-2 border border-slate-200">Specific error messages</td><td class="px-4 py-2 border border-slate-200">Week 4</td><td class="px-4 py-2 border border-slate-200">Actionable recovery</td><td class="px-4 py-2 border border-slate-200">UX Lead</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">9</td><td class="px-4 py-2 border border-slate-200">Confidence microcopy</td><td class="px-4 py-2 border border-slate-200">v0.0.3</td><td class="px-4 py-2 border border-slate-200">Natural language &gt; percentages</td><td class="px-4 py-2 border border-slate-200">UX Lead</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">10</td><td class="px-4 py-2 border border-slate-200">AI recovery flows</td><td class="px-4 py-2 border border-slate-200">v0.0.3</td><td class="px-4 py-2 border border-slate-200">Graceful error handling</td><td class="px-4 py-2 border border-slate-200">UX Lead</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">11</td><td class="px-4 py-2 border border-slate-200">Contextual undo</td><td class="px-4 py-2 border border-slate-200">v0.0.3</td><td class="px-4 py-2 border border-slate-200">Predictability + trust</td><td class="px-4 py-2 border border-slate-200">UX Lead</td></tr></table></div>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">11. Future Considerations</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decisions Deferred</h3>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Topic</td><td class="px-4 py-2 border border-slate-200">Reason</td><td class="px-4 py-2 border border-slate-200">Revisit When</td></tr></table></div>

<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Voice input</td><td class="px-4 py-2 border border-slate-200">Complexity, accuracy</td><td class="px-4 py-2 border border-slate-200">v2.0</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Multi-city trips</td><td class="px-4 py-2 border border-slate-200">Edge case for MVP</td><td class="px-4 py-2 border border-slate-200">User demand</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Expense integration</td><td class="px-4 py-2 border border-slate-200">B2B feature</td><td class="px-4 py-2 border border-slate-200">Corporate tier</td></tr></table></div>
<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm"><tr class="hover:bg-slate-50"><td class="px-4 py-2 border border-slate-200">Price alerts</td><td class="px-4 py-2 border border-slate-200">Nice-to-have</td><td class="px-4 py-2 border border-slate-200">Post-launch</td></tr></table></div>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Open Questions</h3>

<li class="ml-4 my-1 list-decimal list-inside text-slate-700">Should we allow calendar event modification, not just creation?</li>
<li class="ml-4 my-1 list-decimal list-inside text-slate-700">How do we handle timezone conflicts for international travel?</li>
<li class="ml-4 my-1 list-decimal list-inside text-slate-700">Should confidence thresholds be user-configurable?</li>
<li class="ml-4 my-1 list-decimal list-inside text-slate-700">Should recovery flows be dismissible after first confirmation?</li>
<li class="ml-4 my-1 list-decimal list-inside text-slate-700">How verbose should AI uncertainty messages be for power users?</li>

<hr class="border-slate-200 my-8" />

<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">12. Figma Deliverables</h2>

<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Decision: HTML-Based Figma Export</h3>

<strong class="font-semibold text-slate-900">What We Chose:</strong>
<p class="text-slate-700 my-3 leading-relaxed">Self-contained HTML files for Figma import instead of traditional design files.</p>

<strong class="font-semibold text-slate-900">Rationale:</strong>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Preserves exact design tokens and spacing</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Enables rapid iteration with code-first approach</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Seamless import via html.to.design MCP server</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Version controlled with codebase</li>

<strong class="font-semibold text-slate-900">Deliverables (v0.0.4):</strong>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">36 screens (18 mobile + 18 desktop)</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">7 user flow diagrams (3 mobile + 4 desktop)</li>
<li class="ml-4 my-1 list-disc list-inside text-slate-700">Total: 43 HTML files in <code class="bg-slate-100 px-1.5 py-0.5 rounded text-sky-600 text-sm">/figma</code> directory</li>

<hr class="border-slate-200 my-8" />

<p class="text-slate-700 my-3 leading-relaxed"><em class="italic">Document Version: 1.4 (v0.0.4)</em></p>
<p class="text-slate-700 my-3 leading-relaxed"><em class="italic">Last Updated: January 2026</em></p>
<p class="text-slate-700 my-3 leading-relaxed"><em class="italic">Author: Design Team</em></p>
6:["$","div",null,{"className":"min-h-screen bg-white","children":[["$","header",null,{"className":"fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200","children":["$","div",null,{"className":"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between","children":[["$","div",null,{"className":"flex items-center gap-3","children":[["$","div",null,{"className":"w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center","children":["$","svg",null,{"ref":"$undefined","xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-file-text w-5 h-5 text-white","children":[["$","path","1rqfz7",{"d":"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}],["$","path","tnqrlb",{"d":"M14 2v4a2 2 0 0 0 2 2h4"}],["$","path","b1mrlr",{"d":"M10 9H8"}],["$","path","t4e002",{"d":"M16 13H8"}],["$","path","z1uh3a",{"d":"M16 17H8"}],"$undefined"]}]}],["$","div",null,{"children":[["$","h1",null,{"className":"font-bold text-xs sm:text-lg text-slate-900 whitespace-nowrap","children":"Design Decisions"}],["$","p",null,{"className":"hidden sm:block text-xs text-slate-500","children":"SkyWise Documentation"}]]}],["$","$Le",null,{"href":"/docs","children":["$","button",null,{"className":"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] hover:text-slate-900 h-10 w-10 text-slate-700 hover:bg-slate-100","ref":"$undefined","children":["$","svg",null,{"ref":"$undefined","xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-left w-5 h-5","children":[["$","path","1l729n",{"d":"m12 19-7-7 7-7"}],["$","path","x3x0zl",{"d":"M19 12H5"}],"$undefined"]}]}]}]]}],["$","div",null,{"className":"flex items-center gap-1 sm:gap-3","children":[["$","$Le",null,{"href":"/","children":["$","button",null,{"className":"inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] h-9 rounded-lg text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-2 sm:px-3","ref":"$undefined","children":[["$","svg",null,{"ref":"$undefined","xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-house w-4 h-4 sm:mr-2","children":[["$","path","5wwlr5",{"d":"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["$","path","1d0kgt",{"d":"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}],"$undefined"]}],["$","span",null,{"className":"hidden sm:inline","children":"Home"}]]}]}],["$","$Le",null,{"href":"/presentation","className":"hidden sm:block","children":["$","button",null,{"className":"inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] h-9 rounded-lg text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-2 sm:px-3","ref":"$undefined","children":[["$","svg",null,{"ref":"$undefined","xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-presentation w-4 h-4 sm:mr-2","children":[["$","path","91anmk",{"d":"M2 3h20"}],["$","path","2k9sn8",{"d":"M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"}],["$","path","bip4we",{"d":"m7 21 5-5 5 5"}],"$undefined"]}],["$","span",null,{"className":"hidden sm:inline","children":"Presentation"}]]}]}],["$","$Le",null,{"href":"/chat","children":["$","button",null,{"className":"inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:from-sky-600 hover:to-sky-700 h-9 rounded-lg text-xs bg-sky-500 hover:bg-sky-600 text-white px-2 sm:px-3","ref":"$undefined","children":[["$","span",null,{"className":"hidden sm:inline","children":"Try Demo"}],["$","span",null,{"className":"sm:hidden","children":"Demo"}],["$","svg",null,{"ref":"$undefined","xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-right w-4 h-4 ml-1 sm:ml-2","children":[["$","path","1ays0h",{"d":"M5 12h14"}],["$","path","xquz4c",{"d":"m12 5 7 7-7 7"}],"$undefined"]}]]}]}]]}]]}]}],["$","main",null,{"className":"max-w-4xl mx-auto px-6 py-12 pt-32","children":[["$","article",null,{"className":"prose prose-slate max-w-none","dangerouslySetInnerHTML":{"__html":"$f"}}],["$","div",null,{"className":"grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-slate-200","children":[["$","div",null,{"className":"flex justify-start","children":["$","$Le",null,{"href":"/docs/COMPETITIVE_ANALYSIS","children":["$","button",null,{"className":"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] h-11 px-5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs sm:text-sm","ref":"$undefined","children":[["$","svg",null,{"ref":"$undefined","xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-left w-4 h-4 mr-1 sm:mr-2 flex-shrink-0","children":[["$","path","1l729n",{"d":"m12 19-7-7 7-7"}],["$","path","x3x0zl",{"d":"M19 12H5"}],"$undefined"]}],["$","span",null,{"className":"truncate","children":"Competitive Analysis"}]]}]}]}],["$","div",null,{"className":"flex justify-end","children":["$","$Le",null,{"href":"/docs/CASE_STUDY_MAPPING","children":["$","button",null,{"className":"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] h-11 px-5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs sm:text-sm","ref":"$undefined","children":[["$","span",null,{"className":"truncate","children":"Case Study Mapping"}],["$","svg",null,{"ref":"$undefined","xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-right w-4 h-4 ml-1 sm:ml-2 flex-shrink-0","children":[["$","path","1ays0h",{"d":"M5 12h14"}],["$","path","xquz4c",{"d":"m12 5 7 7-7 7"}],"$undefined"]}]]}]}]}]]}]]}],["$","footer",null,{"className":"border-t border-slate-200 bg-slate-50","children":["$","div",null,{"className":"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8","children":["$","div",null,{"className":"flex flex-col md:flex-row items-center justify-between gap-4","children":[["$","div",null,{"className":"flex items-center gap-2","children":[["$","svg",null,{"ref":"$undefined","xmlns":"http://www.w3.org/2000/svg","width":24,"height":24,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-plane h-5 w-5 text-sky-500","children":[["$","path","1v9wt8",{"d":"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"}],"$undefined"]}],["$","span",null,{"className":"font-semibold text-slate-900","children":"SkyWise"}]]}],["$","div",null,{"className":"flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-slate-500 text-center","children":[["$","div",null,{"className":"flex items-center gap-4","children":[["$","$Le",null,{"href":"/presentation","className":"hover:text-sky-500 transition-colors","children":"Presentation"}],["$","span",null,{"children":"•"}],["$","$Le",null,{"href":"/docs","className":"hover:text-sky-500 transition-colors","children":"Documentation"}]]}],["$","span",null,{"className":"hidden sm:inline","children":"•"}],["$","span",null,{"className":"text-xs sm:text-sm","children":"Made for Efsora Labs by Cem Bilen"}]]}]]}]}]}]]}]
c:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
a:[["$","meta","0",{"charSet":"utf-8"}],["$","title","1",{"children":"SkyWise - AI Travel Assistant"}],["$","meta","2",{"name":"description","content":"Your intelligent travel companion that understands your schedule, reads your confirmation emails, and helps you book, manage, and protect your travel plans."}],["$","meta","3",{"name":"author","content":"SkyWise"}],["$","meta","4",{"name":"keywords","content":"travel,flights,AI assistant,booking,calendar,email integration"}],["$","meta","5",{"property":"og:title","content":"SkyWise - AI Travel Assistant"}],["$","meta","6",{"property":"og:description","content":"Fly smarter, not harder."}],["$","meta","7",{"property":"og:type","content":"website"}],["$","meta","8",{"name":"twitter:card","content":"summary"}],["$","meta","9",{"name":"twitter:title","content":"SkyWise - AI Travel Assistant"}],["$","meta","10",{"name":"twitter:description","content":"Fly smarter, not harder."}],["$","link","11",{"rel":"icon","href":"/icon.svg"}],["$","link","12",{"rel":"apple-touch-icon","href":"/apple-icon.svg"}]]
8:null
