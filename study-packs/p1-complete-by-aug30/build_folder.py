from pathlib import Path
import shutil
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[2]
SHARED = ROOT / "tmp/pdfs/next-three/build_next_three_packs.py"
ns = {}
exec(SHARED.read_text().split("# P1 DAY 4")[0], ns)
globals().update(ns)

OUT = ROOT / "output/pdf/p1-complete-by-aug30"
COURSE = OUT / "01-p1-complete-coursebook-days-01-14.pdf"
GUIDE = OUT / "02-p1-formula-and-method-guide.pdf"
CHECK = OUT / "03-p1-day06-checkpoint-question-paper.pdf"
CHECK_MS = OUT / "04-p1-day06-checkpoint-mark-scheme.pdf"
TRACKER = OUT / "05-p1-aug24-30-progress-tracker.pdf"
MOCK = OUT / "06-p1-final-75-mark-mock.pdf"
MOCK_MS = OUT / "07-p1-final-75-mark-mock-mark-scheme.pdf"

DAY_FILES = [
    ROOT / "output/pdf/as-maths-p1-day-1-quadratics-self-learning.pdf",
    ROOT / "output/pdf/as-maths-p1-day-2-quadratics-discriminant.pdf",
    ROOT / "output/pdf/as-maths-p1-day-3-graphs-inequalities-parameters.pdf",
    ROOT / "output/pdf/as-maths-p1-day-4-functions.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-05-coordinate-geometry.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-06-circles.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-07-radians.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-08-trigonometry.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-09-binomial.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-10-series.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-11-differentiation.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-12-stationary-points.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-13-integration.pdf",
    ROOT / "output/pdf/next-10-days/p1-day-14-consolidation.pdf",
]


def merge_coursebook():
    writer = PdfWriter()
    for source in DAY_FILES:
        if not source.exists():
            raise FileNotFoundError(source)
        for page in PdfReader(str(source)).pages:
            writer.add_page(page)
    writer.add_metadata({"/Title": "P1 Complete Coursebook Days 1-14", "/Author": "Rohan Study System"})
    OUT.mkdir(parents=True, exist_ok=True)
    with COURSE.open("wb") as f:
        writer.write(f)


def make_guide():
    s = cover("AS MATHEMATICS 9709 - PURE 1", "Formula and method guide", "The complete P1 memory book", "Use one compact guide to select methods across all eight syllabus sections.", "Do not memorise passively. Cover the right side, say the method aloud, then reproduce it from memory.")
    s += page_title("1-3", "Algebra, functions and coordinates", "Foundations that appear throughout the paper.")
    s += [table([
        ["Skill", "Formula / method", "Check"],
        ["Complete square", "x^2+bx+c=(x+b/2)^2+c-(b/2)^2", "Expand back"],
        ["Quadratic roots", "x=(-b+-sqrt(b^2-4ac))/(2a)", "Both roots"],
        ["Discriminant", "D=b^2-4ac: D>0 two, D=0 repeated, D<0 none", "Use inequality"],
        ["Composite", "fg(x)=f(g(x)); do the inside function first", "Order matters"],
        ["Inverse", "Write y=f(x), swap x and y, rearrange", "Check f^-1(f(x))=x"],
        ["Gradient", "m=(y2-y1)/(x2-x1)", "Keep point order"],
        ["Line", "y-y1=m(x-x1)", "Substitute point"],
        ["Distance", "sqrt((x2-x1)^2+(y2-y1)^2)", "Positive"],
        ["Midpoint", "((x1+x2)/2,(y1+y2)/2)", "Between points"],
        ["Perpendicular", "m1*m2=-1", "Negative reciprocal"],
    ], [35*mm, 105*mm, 34*mm]), Spacer(1, 8), callout("Circle bridge", "(x-a)^2+(y-b)^2=r^2 has centre (a,b). A tangent is perpendicular to the radius at the contact point.", TEAL_LIGHT, TEAL), PageBreak()]
    s += page_title("4-5", "Circular measure and trigonometry", "Angles must be in the correct unit.")
    s += [table([
        ["Skill", "Formula / method"],
        ["Conversion", "180 degrees=pi radians; degrees x pi/180; radians x 180/pi"],
        ["Arc", "s=r theta, with theta in radians"],
        ["Sector", "A=(1/2)r^2 theta"],
        ["Segment", "A=(1/2)r^2(theta-sin theta)"],
        ["Identities", "sin^2 x+cos^2 x=1; tan x=sin x/cos x"],
        ["Exact values", "Know sin, cos and tan at 30, 45 and 60 degrees plus related angles"],
        ["Graphs", "State amplitude, period, range and transformations"],
        ["Equation", "Isolate trig function; reference angle; quadrants; interval check"],
    ], [43*mm, 131*mm]), Spacer(1, 8), callout("Graph periods", "sin(kx) and cos(kx) have period 2pi/k. tan(kx) has period pi/k.", BLUE_LIGHT, BLUE), Spacer(1, 8),
        table([["Quadrant", "sin", "cos", "tan"], ["I", "+", "+", "+"], ["II", "+", "-", "-"], ["III", "-", "-", "+"], ["IV", "-", "+", "-"]], [44*mm]*3+[42*mm]), PageBreak()]
    s += page_title("6", "Series", "Choose AP, GP or binomial from the structure.")
    s += [table([
        ["Model", "Term", "Sum / coefficient"],
        ["AP", "u_n=a+(n-1)d", "S_n=n/2[2a+(n-1)d]=n/2(a+l)"],
        ["GP", "u_n=ar^(n-1)", "S_n=a(1-r^n)/(1-r)"],
        ["Infinite GP", "Requires |r|<1", "S_infinity=a/(1-r)"],
        ["Binomial", "Term r+1 uses C(n,r)a^(n-r)b^r", "Track number, sign and x-power"],
    ], [35*mm, 65*mm, 74*mm]), Spacer(1, 10), callout("Selection", "Subtract consecutive terms to test an AP. Divide consecutive terms to test a GP. In a binomial expansion, r begins at zero.", ORANGE_LIGHT, ORANGE), Spacer(1, 10),
        P("Binomial checklist", "H2x"), bullet("Write the general term before hunting a coefficient."), bullet("For (a-b)^n, the sign depends on the power of -b."), bullet("For a constant term involving x and 1/x, set the total power of x equal to zero."), PageBreak()]
    s += page_title("7-8", "Differentiation and integration", "Calculus connects gradient, change and area.")
    s += [table([
        ["Skill", "Method"],
        ["Differentiate", "d/dx(x^n)=nx^(n-1); work term by term"],
        ["Tangent", "Find point; evaluate dy/dx; use y-y1=m(x-x1)"],
        ["Normal", "Use negative reciprocal of tangent gradient"],
        ["Stationary", "Solve dy/dx=0; find y; classify by sign or second derivative"],
        ["Integrate", "Integral x^n dx=x^(n+1)/(n+1)+C, n not -1"],
        ["Find C", "Integrate first, then substitute the given point"],
        ["Definite", "Evaluate F(upper)-F(lower)"],
        ["Area", "Sketch; split at crossings; area must be positive"],
        ["Volume", "About x-axis: V=pi integral y^2 dx"],
    ], [43*mm, 131*mm]), Spacer(1, 8), callout("Calculus chain", "Differentiate -> equation of gradient -> solve. Integrate -> primitive -> limits or constant -> interpret.", TEAL_LIGHT, TEAL), PageBreak()]
    s += page_title("Exam use", "The 110-minute routine", "Paper 1 contains 75 marks.")
    s += [table([["Time", "Action"], ["0-5 min", "Scan; begin with accessible questions"], ["5-95 min", "Work at about 1.3 minutes per mark"], ["95-105 min", "Return to incomplete parts"], ["105-110 min", "Check signs, intervals, exact form and omitted parts"]], [37*mm, 137*mm]), Spacer(1, 10),
          callout("When stuck", "Write the relevant identity, formula or derivative. Substitute known values. Leave space and move on. A visible method can earn marks.", ORANGE_LIGHT, ORANGE), Spacer(1, 10),
          table([["Final check", "Done"], ["Both quadratic roots", ""], ["Trig solutions inside interval", ""], ["Radians used for arc/sector", ""], ["+C on indefinite integrals", ""], ["Exact form preserved", ""], ["Every question attempted", ""]], [140*mm, 34*mm], heights=[9*mm]+[18*mm]*6)]
    build(str(GUIDE), "P1 Formula and Method Guide", "Cambridge 9709 Pure Mathematics 1", "Rohan Study System | P1 Formula Guide", s)


def make_tracker():
    s = cover("P1 COMPLETION CONTROL", "24-30 August tracker", "Seven intensive days to finish the syllabus", "Complete every remaining P1 topic by 30 August and preserve evidence of learning.", "A topic is not complete because the notes were read. It is complete only after independent questions, marking and corrections.")
    s += page_title("Schedule", "Seven-day execution plan", "Daily P1 target: 3 to 4 focused hours.")
    rows=[["Date", "Main work", "Required evidence", "Done"]]
    data=[("24 Aug","Circular measure","Day 7 pack + 12 exam marks"),("25 Aug","Trigonometry","Day 8 pack + 20 exam marks"),("26 Aug","Binomial, AP and GP","Days 9-10 + 20 exam marks"),("27 Aug","Differentiation","Days 11-12 + 20 exam marks"),("28 Aug","Integration","Day 13 + 20 exam marks"),("29 Aug","Mixed repair","Day 14 + weakest 3 topics"),("30 Aug","Full P1 mock","75 marks + correction log")]
    rows += [[a,b,c,""] for a,b,c in data]
    s += [table(rows,[25*mm,47*mm,78*mm,24*mm],heights=[9*mm]+[21*mm]*7),Spacer(1,8),callout("Non-negotiable", "Mark on the same day. Any score below 60% triggers relearning before the next mixed set.", ORANGE_LIGHT, ORANGE),PageBreak()]
    s += page_title("Mastery", "Eight-section syllabus checklist", "RAG rating: Red below 60%, Amber 60-79%, Green 80%+.")
    rows=[["Section", "Can do without notes", "Best score", "R/A/G"]]
    skills=[("Quadratics","complete square; roots; discriminant; inequalities"),("Functions","notation; composites; inverses; domain/range"),("Coordinate geometry","lines; distance; midpoint; perpendicular; circles"),("Circular measure","convert; arc; sector; segment"),("Trigonometry","graphs; exact values; identities; equations"),("Series","binomial; AP; GP; infinite GP"),("Differentiation","rules; tangents; normals; stationary points"),("Integration","primitive; C; definite; area; volume")]
    rows += [[a,b,"",""] for a,b in skills]
    s += [table(rows,[36*mm,93*mm,25*mm,20*mm],heights=[9*mm]+[23*mm]*8),PageBreak()]
    s += page_title("Corrections", "Error log", "Record the first wrong step, not merely the final answer.")
    s += [table([["Date/Q", "Topic", "Error type", "First wrong step", "Correct rule", "Retest"]]+[["","","","","",""] for _ in range(8)],[23*mm,27*mm,29*mm,43*mm,37*mm,15*mm],heights=[9*mm]+[23*mm]*8),PageBreak()]
    s += page_title("Final record", "Mock and next actions", "Use topic percentages to choose revision priorities.")
    s += [table([["Section", "Available", "Score", "%", "Next action"]]+[[a,str(m),"","",""] for a,m in [("Quadratics",7),("Functions",7),("Coordinate",8),("Circular",7),("Trigonometry",15),("Series",8),("Differentiation",8),("Integration",15)]],[34*mm,24*mm,21*mm,19*mm,76*mm],heights=[9*mm]+[17*mm]*8),Spacer(1,8),
          answer_box("Three highest-priority repairs:",30*mm),Spacer(1,5),answer_box("Retest date and target:",20*mm)]
    build(str(TRACKER), "P1 24-30 August Progress Tracker", "P1 completion schedule and error log", "Rohan Study System | P1 Completion Tracker", s)


def q(number, title, marks, parts):
    out=[P(f"QUESTION {number}","Kicker"),P(title,"H2x"),P(f"[{marks} marks]","Smallx")]
    for text, m, h in parts:
        out += [P(f"{text} <b>[{m}]</b>","Question"),RuledLines(h*mm),Spacer(1,3)]
    return out


def make_mock():
    s=cover("CAMBRIDGE 9709 - PURE MATHEMATICS 1", "Final P1 mock", "Full syllabus checkpoint - 75 marks", "Complete a timed 1 hour 50 minute paper across all eight P1 sections.", "Closed book. Calculator allowed. Show sufficient working. Give exact answers unless instructed otherwise. Stop at 110 minutes.")
    s+=page_title("Instructions","Candidate information","Ten structured questions. Answer every question.")
    s += [table([["Time","1 hour 50 minutes"],["Marks","75"],["Questions","10 compulsory structured questions"],["Coverage","All eight Pure Mathematics 1 sections"]],[41*mm,133*mm],header=False),Spacer(1,9),callout("Timing","Work at roughly 1.3 minutes per mark and reserve the final 10 minutes for checking.",BLUE_LIGHT,BLUE),PageBreak()]
    s+=page_title("Questions 1-2","Quadratics and functions")
    s+=q(1,"Quadratic structure",7,[("(a) Express 2x^2-12x+11 in completed-square form.",3,22),("(b) Hence solve 2x^2-12x+11=0 exactly.",2,24),("(c) Solve 2x^2-12x+11&gt;0.",2,28)])
    s += [PageBreak()] + page_title("Question 2", "Functions")
    s+=q(2,"Functions",7,[("Let f(x)=3x+1 and g(x)=x^2-4 with domain x&gt;=0.",0,8),("(a) Find fg(x).",2,20),("(b) Find gf(x).",2,24),("(c) Find g^-1(x).",2,22),("(d) State the range of g.",1,15)])+[PageBreak()]
    s+=page_title("Questions 3-4","Coordinate geometry and circular measure")
    s+=q(3,"Straight-line geometry",8,[("Points A=(-1,2) and B=(5,10). Find the gradient of AB.",2,18),("(b) Find the exact length AB.",2,20),("(c) Find an equation of AB.",2,22),("(d) Find the perpendicular bisector of AB.",2,28)])
    s += [PageBreak()] + page_title("Question 4", "Circular measure")
    s+=q(4,"Sector and segment",7,[("A sector has radius 6 cm and angle 2pi/3 radians. Find its arc length.",2,18),("(b) Find its area.",2,18),("(c) Find the area of the minor segment.",3,30)])+[PageBreak()]
    s+=page_title("Questions 5-6","Trigonometry")
    s+=q(5,"Exact values and transformations",7,[("(a) State the exact values of sin(7pi/6) and tan(3pi/4).",2,20),("For y=2sin(3x)-1, state (b) the amplitude and period.",2,18),("(c) State the range.",1,15),("(d) Solve cos x=-sqrt(3)/2 for 0&lt;=x&lt;=2pi.",2,25)])
    s += [PageBreak()] + page_title("Question 6", "Trigonometric identities and equations")
    s+=q(6,"Identities and equations",8,[("(a) Prove (1-cos^2 x)/sin x is identical to sin x.",2,20),("(b) Solve 2sin^2 x-3sin x+1=0 for 0&lt;=x&lt;=360 degrees.",4,35),("(c) Solve tan(2x)=1 for 0&lt;=x&lt;=180 degrees.",2,27)])+[PageBreak()]
    s+=page_title("Question 7","Series")
    s+=q(7,"Progressions and binomial expansion",8,[("An AP has third term 11 and eighth term 31. Find a and d.",3,30),("(b) Find the sum of its first 20 terms.",2,26),("(c) Find the coefficient of x^3 in (2-x)^6.",3,34)])+[PageBreak()]
    s+=page_title("Question 8","Differentiation")
    s+=q(8,"Stationary points",8,[("Given y=2x^3-9x^2+12x, find dy/dx and factorise it.",2,24),("(b) Find the coordinates of both stationary points.",3,34),("(c) Classify both points.",2,24),("(d) Find the tangent at x=0.",1,20)])+[PageBreak()]
    s+=page_title("Questions 9-10","Integration and mixed calculus")
    s+=q(9,"Integration",8,[("(a) Integrate 6x^2-4x+3.",2,20),("Given dy/dx=6x^2-4x+3 and y=5 at x=1, find y in terms of x.",2,25),("(c) Evaluate the integral from 0 to 2 of 6x^2-4x+3.",2,22),("(d) The region under y=sqrt(x), from x=0 to x=4, rotates about the x-axis. Find its volume.",2,28)])
    s += [PageBreak()] + page_title("Question 10", "Curve analysis")
    s+=q(10,"Curve analysis",7,[("The curve is y=4x-x^2. Find its x-axis intersections.",1,16),("(b) Find the coordinates and nature of its stationary point.",3,27),("(c) Find the area between the curve and the x-axis.",3,35)])
    s += [callout("End of paper","Stop at 110 minutes. Record the score by topic in the tracker before opening the mark scheme.",GREEN_LIGHT,TEAL)]
    build(str(MOCK),"P1 Final 75-Mark Mock","Cambridge 9709 Pure Mathematics 1 full syllabus mock","Rohan Study System | P1 Final Mock",s)


def make_mock_marks():
    s=cover("TEACHER COPY", "Final P1 mock mark scheme", "75 marks - full syllabus", "Mark methods consistently and convert every lost mark into a correction task.", "Keep closed until the timed mock is finished. Equivalent exact forms are acceptable.")
    s+=page_title("Overview","Mark allocation and thresholds","M=method, A=accuracy, B=independent result.")
    s += [table([["Section","Marks"],["Quadratics","7"],["Functions","7"],["Coordinate geometry","8"],["Circular measure","7"],["Trigonometry","15"],["Series","8"],["Differentiation","8"],["Integration/calculus","15"],["Total","75"]],[120*mm,54*mm]),Spacer(1,8),callout("Working target","60+ secure; 52-59 strong with repairs; 42-51 developing; below 42 requires systematic reteaching before repeated full papers.",BLUE_LIGHT,BLUE),PageBreak()]
    schemes=[
      ("Questions 1-2","Quadratics and functions",[("1(a)","2(x-3)^2-7. M1 factor 2; M1 square; A1.",3),("1(b)","x=3+-sqrt(14)/2. M1 from square; A1 exact roots.",2),("1(c)","x&lt;3-sqrt(14)/2 or x&gt;3+sqrt(14)/2. M1 roots/shape; A1.",2),("2(a)","fg=3x^2-11. M1 order; A1.",2),("2(b)","gf=(3x+1)^2-4=9x^2+6x-3. M1; A1.",2),("2(c)","g^-1(x)=sqrt(x+4). M1; A1.",2),("2(d)","Range [-4,infinity). B1.",1)]),
      ("Questions 3-4","Coordinate and circular measure",[("3(a)","4/3. M1+A1.",2),("3(b)","10. M1+A1.",2),("3(c)","y-2=(4/3)(x+1), e.g. 3y=4x+10. M1+A1.",2),("3(d)","Midpoint (2,6), perpendicular m=-3/4; y-6=(-3/4)(x-2). M1+A1.",2),("4(a)","4pi cm. M1+A1.",2),("4(b)","12pi cm^2. M1+A1.",2),("4(c)","12pi-9sqrt(3) cm^2. M1 triangle; M1 subtract; A1.",3)]),
      ("Questions 5-6","Trigonometry",[("5(a)","-1/2 and -1. B1 each.",2),("5(b)","Amplitude 2; period 2pi/3. B1 each.",2),("5(c)","[-3,1]. B1.",1),("5(d)","5pi/6, 7pi/6. B1 each.",2),("6(a)","1-cos^2x=sin^2x, then divide by sin x. M1+A1.",2),("6(b)","(2sinx-1)(sinx-1)=0; x=30,90,150 degrees. M1 factor; M1 cases; A1 solutions; A1 complete.",4),("6(c)","x=22.5,112.5 degrees. M1+A1.",2)]),
      ("Question 7","Series",[("7(a)","a+2d=11, a+7d=31; d=4,a=3. M1 equations; A1 d; A1 a.",3),("7(b)","S20=820. M1 formula; A1.",2),("7(c)","C(6,3)2^3(-1)^3=-160. M1 term; M1 powers/sign; A1.",3)]),
      ("Question 8","Differentiation",[("8(a)","6x^2-18x+12=6(x-1)(x-2). M1+A1.",2),("8(b)","(1,5) and (2,4). M1 roots; A1 each coordinate pair.",3),("8(c)","(1,5) maximum; (2,4) minimum. B1 each.",2),("8(d)","y=12x. B1.",1)]),
      ("Questions 9-10","Integration and calculus",[("9(a)","2x^3-2x^2+3x+C. M1+A1.",2),("9(b)","C=2, so y=2x^3-2x^2+3x+2. M1+A1.",2),("9(c)","14. M1+A1.",2),("9(d)","V=pi integral 0 to4 x dx=8pi. M1+A1.",2),("10(a)","x=0,4. B1.",1),("10(b)","(2,4), maximum. M1 derivative/solve; A1 coordinate; A1 nature.",3),("10(c)","Integral 0 to4 (4x-x^2) dx=32/3. M1 limits; M1 primitive; A1.",3)])]
    for idx,(k,title,rows) in enumerate(schemes):
        s += page_title(k,title)
        s += [table([["Part","Answer and allocation","Marks"]]+[[a,b,str(c)] for a,b,c in rows],[18*mm,137*mm,19*mm])]
        if idx < len(schemes)-1: s += [PageBreak()]
    s += [Spacer(1,8),callout("After marking","Enter topic percentages in the tracker. Redo every lost mark without looking, then assign a three-question retest to each topic below 80%.",GREEN_LIGHT,TEAL)]
    build(str(MOCK_MS),"P1 Final Mock Mark Scheme","Cambridge 9709 Pure Mathematics 1 mark scheme","Rohan Study System | P1 Final Mock Mark Scheme",s)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    merge_coursebook()
    make_guide()
    shutil.copy2(ROOT / "output/pdf/exams/p1-checkpoint-after-day-06-question-paper.pdf", CHECK)
    shutil.copy2(ROOT / "output/pdf/exams/p1-checkpoint-after-day-06-mark-scheme.pdf", CHECK_MS)
    make_tracker()
    make_mock()
    make_mock_marks()
    print("\n".join(str(p) for p in [COURSE, GUIDE, CHECK, CHECK_MS, TRACKER, MOCK, MOCK_MS]))
