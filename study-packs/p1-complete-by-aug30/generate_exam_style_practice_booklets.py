from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SHARED = ROOT / "tmp/pdfs/next-three/build_next_three_packs.py"
ns = {}
exec(SHARED.read_text().split("# P1 DAY 4")[0], ns)
globals().update(ns)

OUT = ROOT / "output/pdf/p1-complete-by-aug30"
BOOK1 = OUT / "04e-p1-day06-exam-practice-booklet-1.pdf"
BOOK2 = OUT / "04f-p1-day06-exam-practice-booklet-2.pdf"


PAPER1 = [
    dict(n=1,title="Quadratic forms",marks=7,parts=[("(a) Expand and simplify (2x-1)(x+5).",2),("(b) Complete the square: x^2-4x-5.",2),("(c) State the turning point of y=x^2-4x-5.",1),("(d) Hence solve x^2-4x-5=0.",2)],solutions=["Four products: 2x^2+10x-x-5=2x^2+9x-5.","Half of -4 is -2: x^2-4x-5=(x-2)^2-4-5=(x-2)^2-9.","The square is zero at x=2, so the turning point is (2,-9).","Set (x-2)^2-9=0. Then (x-2)^2=9, so x-2=+-3 and x=5 or -1."]),
    dict(n=2,title="Discriminant and repeated roots",marks=6,parts=[("(a) Find the discriminant of 2x^2+3x+5=0 and state the number of real roots.",3),("(b) Find k if x^2-8x+k=0 has a repeated root.",3)],solutions=["a=2,b=3,c=5. D=3^2-4(2)(5)=9-40=-31. Because D&lt;0, there are no real roots.","Repeated root means D=0. D=(-8)^2-4k=64-4k. Set 64-4k=0, so k=16."]),
    dict(n=3,title="Quadratic inequalities",marks=6,parts=[("(a) Solve x^2-7x+6&lt;=0.",3),("(b) Solve 2x^2+7x+3&gt;0.",3)],solutions=["Factor: (x-1)(x-6)&lt;=0. The upward parabola is non-positive between the roots, including them: 1&lt;=x&lt;=6.","Factor: (2x+1)(x+3)&gt;0. Roots are -3 and -1/2. The upward parabola is positive outside: x&lt;-3 or x&gt;-1/2."]),
    dict(n=4,title="Composite functions",marks=7,given="f(x)=2x+3 and g(x)=x^2-1.",parts=[("(a) Find f(-4).",1),("(b) Find fg(x).",2),("(c) Find gf(x).",2),("(d) Show clearly that fg(x) is not equal to gf(x).",2)],solutions=["f(-4)=2(-4)+3=-8+3=-5.","Apply g first: fg(x)=f(x^2-1)=2(x^2-1)+3=2x^2+1.","Apply f first: gf(x)=g(2x+3)=(2x+3)^2-1=4x^2+12x+8.","The simplified expressions 2x^2+1 and 4x^2+12x+8 are different, so the composites are not equal."]),
    dict(n=5,title="Inverse function",marks=6,given="f(x)=5-2x.",parts=[("(a) Find f^-1(x).",3),("(b) Find f^-1(9).",1),("(c) Verify that f(f^-1(x))=x.",2)],solutions=["Write y=5-2x. Swap x and y: x=5-2y. Then 2y=5-x, so f^-1(x)=(5-x)/2.","f^-1(9)=(5-9)/2=-4/2=-2.","f(f^-1(x))=5-2[(5-x)/2]=5-(5-x)=x. This confirms the functions undo each other."]),
    dict(n=6,title="Coordinate geometry",marks=6,given="A=(1,-2) and B=(7,6).",parts=[("(a) Find the gradient of AB.",2),("(b) Find the midpoint of AB.",1),("(c) Find the exact length AB.",2),("(d) Write an equation of AB.",1)],solutions=["m=(6-(-2))/(7-1)=8/6=4/3.","Midpoint=((1+7)/2,(-2+6)/2)=(4,2).","Changes are 6 and 8, so AB=sqrt(6^2+8^2)=10.","Using A: y+2=(4/3)(x-1). Any equivalent equation is correct."]),
    dict(n=7,title="Parallel and perpendicular lines",marks=6,given="Use A and B from Question 6.",parts=[("(a) Find the perpendicular bisector of AB.",3),("(b) Find the line through (-2,5) parallel to AB.",3)],solutions=["AB has m=4/3, so perpendicular m=-3/4. It passes through midpoint (4,2): y-2=(-3/4)(x-4).","A parallel line has m=4/3. Through (-2,5): y-5=(4/3)(x+2)."]),
    dict(n=8,title="Circle and tangent",marks=6,given="C: (x-1)^2+(y+2)^2=36.",parts=[("(a) State the centre and radius.",2),("(b) Show that P=(1,4) lies on C.",2),("(c) Find the tangent to C at P.",2)],solutions=["Centre (1,-2), radius sqrt(36)=6.","At P: (1-1)^2+(4+2)^2=0+36=36, so P lies on C.","The radius from (1,-2) to (1,4) is vertical, x=1. The tangent is horizontal through P, so y=4."]),
]

PAPER2 = [
    dict(n=1,title="Completed square and exact roots",marks=7,parts=[("(a) Express 3x^2-12x+7 in completed-square form.",3),("(b) Hence solve 3x^2-12x+7=0 exactly.",2),("(c) Solve 3x^2-12x+7&lt;0.",2)],solutions=["Factor 3 from the x terms: 3(x^2-4x)+7=3[(x-2)^2-4]+7=3(x-2)^2-5.","Set 3(x-2)^2-5=0. Then (x-2)^2=5/3, so x=2+-sqrt(15)/3.","The upward parabola is negative between its roots: 2-sqrt(15)/3&lt;x&lt;2+sqrt(15)/3."]),
    dict(n=2,title="Parameter and number of roots",marks=6,parts=[("The equation x^2+(k-2)x+k=0 has a repeated root. Find the possible values of k.",4),("(b) Hence state the values of k for which the equation has no real roots.",2)],solutions=["Repeated means D=0: (k-2)^2-4k=0. Expand to k^2-8k+4=0. Formula gives k=[8+-sqrt(64-16)]/2=4+-2sqrt(3).","D=k^2-8k+4 is negative between its roots. Therefore 4-2sqrt(3)&lt;k&lt;4+2sqrt(3)."]),
    dict(n=3,title="Restricted inverse",marks=6,given="h(x)=(x-1)^2-4, with domain x&gt;=1.",parts=[("(a) State the range of h.",1),("(b) Find h^-1(x).",3),("(c) Solve h^-1(x)=5.",2)],solutions=["The square is at least zero, so h(x) is at least -4. Range: y&gt;=-4.","Write y=(x-1)^2-4. Then y+4=(x-1)^2. Since x&gt;=1, take the positive root: x=1+sqrt(y+4). Thus h^-1(x)=1+sqrt(x+4).","1+sqrt(x+4)=5, so sqrt(x+4)=4, x+4=16 and x=12."]),
    dict(n=4,title="Composite equation",marks=6,given="f(x)=3x-1 and g(x)=2-x.",parts=[("(a) Find fg(x).",2),("(b) Find gf(x).",2),("(c) Solve fg(x)=gf(x), explaining your result.",2)],solutions=["fg(x)=f(2-x)=3(2-x)-1=5-3x.","gf(x)=g(3x-1)=2-(3x-1)=3-3x.","5-3x=3-3x simplifies to 5=3, which is impossible. Therefore there is no solution; the expressions differ by 2 for every x."]),
    dict(n=5,title="Line and perpendicular bisector",marks=7,given="A=(-3,4) and B=(5,-2).",parts=[("(a) Find the gradient of AB.",2),("(b) Find an equation of AB in integer form.",2),("(c) Find the perpendicular bisector of AB.",3)],solutions=["m=(-2-4)/(5-(-3))=-6/8=-3/4.","Using A: y-4=(-3/4)(x+3). Multiply by 4 and rearrange: 3x+4y=7.","Midpoint=(1,1). Perpendicular gradient=4/3. So y-1=(4/3)(x-1), or 4x-3y=1."]),
    dict(n=6,title="Circle intersections",marks=6,given="C: x^2+y^2+8x-2y-8=0.",parts=[("(a) Write C in completed-square form and state its centre and radius.",3),("(b) Find the exact points where C meets the x-axis.",3)],solutions=["x^2+8x=(x+4)^2-16 and y^2-2y=(y-1)^2-1. Hence (x+4)^2+(y-1)^2=25. Centre (-4,1), radius 5.","On the x-axis y=0: (x+4)^2+1=25, so (x+4)^2=24. Thus x=-4+-2sqrt(6), giving (-4+2sqrt(6),0) and (-4-2sqrt(6),0)."]),
    dict(n=7,title="Tangent and normal",marks=6,given="Use circle C from Question 6 and P=(0,4).",parts=[("(a) Show P lies on C and find the tangent at P.",3),("(b) Find where the tangent meets the x-axis.",1),("(c) Find the normal at P.",2)],solutions=["From centre (-4,1) to P, the change is (4,3), length 5, so P lies on C. Radius m=3/4, so tangent m=-4/3: y-4=(-4/3)x, or 4x+3y=12.","Set y=0 in 4x+3y=12: x=3, so the point is (3,0).","The normal follows the radius, m=3/4, through P: y-4=(3/4)x."]),
    dict(n=8,title="Mixed line-circle problem",marks=6,given="The line y=x+1 meets (x-1)^2+(y-2)^2=10.",parts=[("(a) Find the exact coordinates of both intersection points.",4),("(b) Find the midpoint of the two intersection points and interpret it.",2)],solutions=["Substitute y=x+1, so y-2=x-1. Then 2(x-1)^2=10, hence (x-1)^2=5 and x=1+-sqrt(5). Since y=x+1, the points are (1+sqrt(5),2+sqrt(5)) and (1-sqrt(5),2-sqrt(5)).","Average coordinates: (1,2). This is also the circle's centre, so the line passes through a diameter."]),
]


def question_block(item):
    out=[P(f"QUESTION {item['n']}","Kicker"),P(item["title"],"H2x"),P(f"[{item['marks']} marks]","Smallx")]
    if item.get("given"):
        out += [callout("Given",item["given"],TEAL_LIGHT,TEAL),Spacer(1,3)]
    for text,marks in item["parts"]:
        out += [P(f"{text} <b>[{marks}]</b>","Question"),RuledLines(14*mm),Spacer(1,3)]
    return out


def solution_table(item):
    return table([["Part","Easy working and answer"]]+[[chr(97+i),answer] for i,answer in enumerate(item["solutions"])],[18*mm,156*mm])


def make_book(path,number,level,paper,topic_scores):
    s=cover(f"P1 DAY 6 - EXAM PRACTICE {number}",f"Structured practice paper {number}",f"{level} - 50 marks - 75 minutes","Complete a realistic structured paper on quadratics, functions, coordinate geometry and circles.","Closed book. Calculator allowed. Answer all eight questions. Show essential working and stop after 75 minutes. Keep the solution section closed.")
    s+=page_title("Instructions","Candidate information","This paper uses linked parts and explicit mark allocations like an examination.")
    s += [table([["Time","75 minutes"],["Marks","50"],["Questions","8 compulsory structured questions"],["Method","Show algebra and exact values; unsupported answers may lose marks"],["Checking","Reserve the final 7 minutes"]],[40*mm,134*mm],header=False),Spacer(1,8),
          table([["Question","Topic","Marks"]]+[[str(x["n"]),x["title"],str(x["marks"])] for x in paper]+[["","Total","50"]],[25*mm,119*mm,30*mm]),Spacer(1,8),callout("Exam rule","If stuck, write the relevant formula or structure, leave space and continue. Return before time ends.",ORANGE_LIGHT,ORANGE),PageBreak()]
    for i in range(0,8,2):
        s += page_title(f"Questions {i+1}-{i+2}","Structured questions",f"Running total after this page: {sum(x['marks'] for x in paper[:i+2])} marks.")
        s += question_block(paper[i])
        s += [HRFlowable(width="100%",thickness=.7,color=LINE,spaceBefore=4,spaceAfter=5)]
        s += question_block(paper[i+1])
        s += [PageBreak()]
    s += page_title("Stop","Solution section locked","Do not continue until the full paper has an attempt and 75 minutes have ended.")
    s += [callout("Before opening","Write your predicted score and identify the two questions you found hardest.",ORANGE_LIGHT,ORANGE),Spacer(1,10),answer_box("Predicted score: ____ / 50. Hardest questions:",45*mm),Spacer(1,10),callout("Marking method","Use another colour. Circle the first wrong line. After reading the explanation, close the booklet and redo the entire part.",BLUE_LIGHT,BLUE),PageBreak()]
    for i in range(0,8,2):
        s += page_title(f"Solutions {i+1}-{i+2}","Easy worked explanations","Equivalent correct methods are acceptable.")
        for item in paper[i:i+2]:
            s += [P(f"Question {item['n']} - {item['title']} [{item['marks']} marks]","H2x"),solution_table(item),Spacer(1,7)]
        if i<6:s += [PageBreak()]
    s += [PageBreak()] + page_title("Correction record","Turn marks into the next lesson","Do not record only the final answer.")
    s += [table([["Q/part","First wrong line","Error type","Correct rule"]]+[["","","",""] for _ in range(7)],[20*mm,63*mm,34*mm,57*mm],heights=[9*mm]+[21*mm]*7),Spacer(1,7),
          table([["Topic","Score","Available","%"]]+[[name,"",str(marks),""] for name,marks in topic_scores]+[["Total","","50",""]],[75*mm,31*mm,37*mm,31*mm]),Spacer(1,7),callout("Retest","Redo every lost mark tomorrow without looking. Any topic below 60% returns to the notes booklet first.",GREEN_LIGHT,TEAL)]
    build(str(path),f"P1 Exam Practice Booklet {number}","Structured practice through P1 Day 6",f"Rohan Study System | P1 Exam Practice {number}",s)


if __name__=="__main__":
    make_book(BOOK1,1,"Foundation and secure method",PAPER1,[("Quadratics",19),("Functions",13),("Coordinate geometry",12),("Circles",6)])
    make_book(BOOK2,2,"Higher challenge and mixed reasoning",PAPER2,[("Quadratics",13),("Functions",12),("Coordinate geometry",7),("Circles",18)])
    print(BOOK1)
    print(BOOK2)
