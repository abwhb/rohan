from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SHARED = ROOT / "tmp/pdfs/next-three/build_next_three_packs.py"
ns = {}
exec(SHARED.read_text().split("# P1 DAY 4")[0], ns)
globals().update(ns)

OUT = ROOT / "output/pdf/p1-complete-by-aug30"
NOTES = OUT / "04c-p1-day06-complete-revision-notes.pdf"
PRACTICE = OUT / "04d-p1-day06-practice-and-easy-solutions.pdf"


def make_notes():
    s = cover("P1 REVISION - EVERYTHING THROUGH DAY 6", "Know the foundations", "Notes, formulas, methods and memory warnings", "Relearn quadratics, functions, coordinate geometry and circles from the beginning in one organised booklet.", "Read actively. Cover each worked example, reproduce it, then say why each step is valid. Use the practice booklet only after finishing these notes.")
    s += page_title("Map", "What you must know", "These four foundations support almost every later P1 topic.")
    s += [table([
        ["Topic", "You must be able to"],
        ["Quadratics", "Expand; factorise; complete the square; solve; sketch; use the discriminant; solve inequalities and parameter conditions"],
        ["Functions", "Use notation; substitute; find composites and inverses; understand domain, range and one-to-one functions"],
        ["Coordinate geometry", "Find gradient, midpoint and distance; form line equations; use parallel and perpendicular gradients"],
        ["Circles", "Read and construct circle equations; complete squares; verify points; find tangent equations and intersections"],
    ], [43*mm, 131*mm]), Spacer(1, 9),
        callout("The universal habit", "Do not begin with arithmetic. Name the method, write its formula or structure, then substitute values.", BLUE_LIGHT, BLUE),
        Spacer(1, 10), P("Symbols you will see", "H2x"),
        table([["Symbol", "Meaning"], ["D", "Discriminant b^2-4ac"], ["f(x)", "Output from function f for input x"], ["fg(x)", "f(g(x)); g happens first"], ["f^-1(x)", "Inverse function; not 1/f(x)"], ["m", "Gradient of a straight line"], ["r", "Radius of a circle"]], [40*mm, 134*mm]), PageBreak()]

    s += page_title("Quadratics 1", "Algebra and completing the square", "A quadratic has highest power x^2.")
    s += [table([["Form", "Example", "Best use"], ["Expanded", "x^2-6x+5", "Read coefficients; discriminate"], ["Factorised", "(x-1)(x-5)", "Read roots"], ["Completed square", "(x-3)^2-4", "Read turning point and range"]], [35*mm, 64*mm, 75*mm]), Spacer(1, 8),
          callout("Expand brackets", "Multiply every term by every term. (x-4)(2x+3)=2x^2+3x-8x-12=2x^2-5x-12.", TEAL_LIGHT, TEAL), Spacer(1, 7),
          P("Completing the square when the x^2 coefficient is 1", "H2x"),
          bullet("For x^2+bx+c, halve b inside the bracket."),
          bullet("Square the bracket, then compensate for the extra constant."),
          callout("Worked example", "x^2-8x+7=(x-4)^2-16+7=(x-4)^2-9. Turning point: (4,-9).", GREEN_LIGHT, TEAL), Spacer(1, 7),
          P("When the x^2 coefficient is not 1", "H2x"),
          callout("Worked example", "2x^2+12x+5=2(x^2+6x)+5=2[(x+3)^2-9]+5=2(x+3)^2-13.", GREEN_LIGHT, TEAL),
          Spacer(1, 7), callout("Remember", "The turning point of y=a(x-h)^2+k is (h,k). The sign inside the bracket reverses.", ORANGE_LIGHT, ORANGE), PageBreak()]

    s += page_title("Quadratics 2", "Solving, discriminants and graphs", "Choose factorising, completed square or the quadratic formula.")
    s += [table([["Method", "When useful", "Key line"], ["Factorise", "Integer/rational roots visible", "Set each factor to zero"], ["Complete square", "Completed form already known", "Square-root gives plus and minus"], ["Formula", "Does not factorise easily", "x=(-b+-sqrt(b^2-4ac))/(2a)"]], [36*mm, 65*mm, 73*mm]), Spacer(1, 8),
          callout("Worked solution", "Solve x^2-6x+2=0: (x-3)^2-7=0, so (x-3)^2=7, x-3=+-sqrt(7), therefore x=3+-sqrt(7).", TEAL_LIGHT, TEAL), Spacer(1, 7),
          P("The discriminant", "H2x"),
          table([["D=b^2-4ac", "Roots", "Graph"], ["D>0", "Two distinct real roots", "Crosses x-axis twice"], ["D=0", "One repeated real root", "Touches x-axis"], ["D&lt;0", "No real roots", "Does not meet x-axis"]], [48*mm, 63*mm, 63*mm]), Spacer(1, 8),
          callout("Parameter example", "x^2+6x+k=0 has a repeated root: D=36-4k=0, so k=9.", GREEN_LIGHT, TEAL),
          Spacer(1, 7), callout("Important", "In ax^2+bx+c, a, b and c are numbers. Include their signs. If the equation is not equal to zero, rearrange it first.", ORANGE_LIGHT, ORANGE), PageBreak()]

    s += page_title("Quadratics 3", "Inequalities and parameter conditions", "Roots divide the number line into sign regions.")
    s += [P("Method for a quadratic inequality", "H2x"),
          bullet("Move everything to one side so the other side is zero."), bullet("Find the boundary roots."), bullet("Decide where the parabola is positive or negative."), bullet("Include roots for &gt;= or &lt;=; exclude them for > or &lt;."),
          callout("Between the roots", "Solve x^2-5x+6&lt;0. Factor: (x-2)(x-3)&lt;0. The parabola opens upward, so it is below the axis between its roots: 2&lt;x&lt;3.", TEAL_LIGHT, TEAL), Spacer(1, 8),
          callout("Outside the roots", "Solve x^2-5x+6&gt;=0. The same parabola is on or above the axis outside its roots: x&lt;=2 or x&gt;=3.", GREEN_LIGHT, TEAL), Spacer(1, 8),
          P("Parameters and numbers of roots", "H2x"),
          bullet("Two real roots: D>0."), bullet("Repeated root: D=0."), bullet("No real roots: D&lt;0."),
          callout("Worked parameter condition", "x^2+px+16=0 has no real roots: p^2-64&lt;0, so p^2&lt;64 and therefore -8&lt;p&lt;8.", BLUE_LIGHT, BLUE),
          Spacer(1, 8), callout("Common trap", "From p^2&lt;64, do not write only p&lt;8. The lower boundary -8 is equally important.", ORANGE_LIGHT, ORANGE), PageBreak()]

    s += page_title("Functions", "Machines, composites and inverses", "A function gives one output for each allowed input.")
    s += [table([["Idea", "Method", "Example"], ["Substitution", "Replace every x; use brackets", "f(x)=2x-3, f(-4)=-11"], ["Composite", "Inside function first", "fg(x)=f(g(x))"], ["Inverse", "Swap x and y; rearrange", "f^-1 undoes f"], ["Domain", "Allowed inputs", "Exclude division by zero"], ["Range", "Outputs produced", "x^2+1 has range y&gt;=1"]], [34*mm, 70*mm, 70*mm]), Spacer(1, 8),
          callout("Composite example", "Let f(x)=2x+1 and g(x)=x^2-3. Then fg(x)=f(x^2-3)=2(x^2-3)+1=2x^2-5. But gf(x)=g(2x+1)=(2x+1)^2-3=4x^2+4x-2.", TEAL_LIGHT, TEAL), Spacer(1, 8),
          callout("Inverse example", "For f(x)=3x-5: y=3x-5; swap to x=3y-5; rearrange y=(x+5)/3. Therefore f^-1(x)=(x+5)/3.", GREEN_LIGHT, TEAL), Spacer(1, 8),
          P("One-to-one warning", "H2x"),
          bullet("A function needs to be one-to-one before it has an inverse function."),
          bullet("g(x)=x^2 is not one-to-one on all real numbers because g(2)=g(-2)."),
          bullet("Restricting the domain to x&gt;=0 makes the inverse sqrt(x)."),
          callout("Remember", "f^-1(x) means inverse function, not reciprocal. fg and gf are usually different.", ORANGE_LIGHT, ORANGE), PageBreak()]

    s += page_title("Coordinate geometry", "Points and straight lines", "Gradient controls direction; one point fixes position.")
    s += [table([["Skill", "Formula"], ["Gradient", "m=(y2-y1)/(x2-x1)"], ["Midpoint", "((x1+x2)/2,(y1+y2)/2)"], ["Distance", "sqrt((x2-x1)^2+(y2-y1)^2)"], ["Line through point", "y-y1=m(x-x1)"], ["Parallel", "Equal gradients"], ["Perpendicular", "m1*m2=-1; negative reciprocals"]], [45*mm, 129*mm]), Spacer(1, 8),
          callout("One complete example", "A=(1,2), B=(7,10). Gradient=(10-2)/(7-1)=4/3. Midpoint=(4,6). Distance=sqrt(6^2+8^2)=10. Line: y-2=(4/3)(x-1).", TEAL_LIGHT, TEAL), Spacer(1, 8),
          callout("Perpendicular bisector", "It needs two facts: it passes through the midpoint, and its gradient is the negative reciprocal. For the example, m=-3/4 and y-6=(-3/4)(x-4).", GREEN_LIGHT, TEAL), Spacer(1, 8),
          P("Checks", "H2x"), bullet("Substitute a known point into your final line equation."), bullet("Distance must be non-negative."), bullet("A midpoint should lie between the endpoints."), bullet("Vertical lines have undefined gradient and equation x=constant."),
          callout("Common trap", "For gradient, subtract coordinates in the same order on top and bottom.", ORANGE_LIGHT, ORANGE), PageBreak()]

    s += page_title("Circles", "Centre, radius, points and tangents", "Circle form converts algebra into geometry.")
    s += [callout("Standard form", "(x-a)^2+(y-b)^2=r^2 has centre (a,b) and radius r. Signs inside brackets reverse when reading the centre.", BLUE_LIGHT, BLUE), Spacer(1, 8),
          P("Complete two squares", "H2x"),
          callout("Worked example", "x^2+y^2-4x+6y-12=0 becomes (x-2)^2-4+(y+3)^2-9-12=0, so (x-2)^2+(y+3)^2=25. Centre (2,-3), radius 5.", TEAL_LIGHT, TEAL), Spacer(1, 8),
          P("Point on a circle", "H2x"), bullet("Substitute the point into the circle equation."), bullet("It lies on the circle only if left side equals r^2."),
          P("Tangent at a point", "H2x"), bullet("Find the centre."), bullet("Find the radius gradient from centre to contact point."), bullet("Take the negative reciprocal for tangent gradient."), bullet("Use the contact point in y-y1=m(x-x1)."),
          callout("Tangent example", "Centre (2,-3), contact P=(5,1): radius m=4/3, tangent m=-3/4. Hence y-1=(-3/4)(x-5), or 3x+4y=19.", GREEN_LIGHT, TEAL), Spacer(1, 7),
          callout("Intersections", "Substitute the line into the circle. Solve the resulting quadratic or squared equation, then report complete coordinate pairs.", ORANGE_LIGHT, ORANGE), PageBreak()]

    s += page_title("Memory page", "Important points to remember", "Say each rule aloud before the practice booklet.")
    reminders=["Completing square: halve the x coefficient inside the bracket.","A square-root equation usually gives plus and minus roots.","Discriminant: positive two roots, zero repeated, negative none.","An upward quadratic is negative between distinct roots and positive outside.","For a composite, perform the function closest to x first.","An inverse is not a reciprocal; one-to-one matters.","Gradient subtraction order must match in numerator and denominator.","Perpendicular gradients are negative reciprocals.","Circle centre signs reverse inside brackets.","A tangent is perpendicular to the radius at the contact point."]
    s += [table([["Rule", "I can explain it"]]+[[x,""] for x in reminders],[145*mm,29*mm],heights=[9*mm]+[17*mm]*len(reminders)),Spacer(1,8),callout("Ready test", "Close this booklet. On blank paper, reproduce the quadratic formula, discriminant rule, composite order, inverse method, five coordinate formulas/rules and circle standard form.", GREEN_LIGHT, TEAL)]
    build(str(NOTES), "P1 Day 6 Complete Revision Notes", "Quadratics, functions, coordinate geometry and circles", "Rohan Study System | P1 Day 6 Revision Notes", s)


QUESTIONS = [
    ("A", "Quadratics", ["1. Expand and simplify (x-5)(2x+3).", "2. Complete the square: x^2+6x-7.", "3. Hence state the turning point of y=x^2+6x-7.", "4. Solve x^2+6x-7=0.", "5. Solve 2x^2+x-6=0."]),
    ("B", "Discriminants and inequalities", ["1. Find the discriminant of x^2-4x+8=0 and state the number of real roots.", "2. Find k if x^2+10x+k=0 has a repeated root.", "3. Find the values of p for which x^2+px+16=0 has no real roots.", "4. Solve x^2-5x+6&lt;0.", "5. Solve 2x^2-x-3&gt;=0."]),
    ("C", "Functions", ["Let f(x)=3x-2 and g(x)=x^2+4.", "1. Find f(-2).", "2. Find f(a+1).", "3. Find fg(x).", "4. Find gf(x).", "5. Find f^-1(x), then explain why g has no inverse on all real numbers."]),
    ("D", "Coordinate geometry", ["Points A=(-2,1) and B=(4,9).", "1. Find the gradient of AB.", "2. Find the midpoint of AB.", "3. Find the exact length AB.", "4. Find the equation of AB.", "5. Find the perpendicular bisector of AB."]),
    ("E", "Circles", ["Circle C: x^2+y^2-4x+6y-12=0.", "1. Write C in completed-square form; state its centre and radius.", "2. Show that P=(5,1) lies on C.", "3. Find the tangent to C at P.", "4. Find the intersections of C with y=-3.", "5. Write the equation of a circle with centre (-1,2) and radius 3."]),
]

SOLUTIONS = [
    ("A", "Quadratics", [
        "1. Multiply all four pairs: 2x^2+3x-10x-15=2x^2-7x-15.",
        "2. Half of 6 is 3: x^2+6x-7=(x+3)^2-9-7=(x+3)^2-16.",
        "3. The minimum square occurs at x=-3, and y=-16. Turning point (-3,-16).",
        "4. Use (x+3)^2-16=0. Then (x+3)^2=16, x+3=+-4, so x=1 or x=-7.",
        "5. Factor: 2x^2+x-6=(2x-3)(x+2). Therefore x=3/2 or x=-2.",
    ]),
    ("B", "Discriminants and inequalities", [
        "1. a=1,b=-4,c=8. D=(-4)^2-4(1)(8)=16-32=-16. Since D&lt;0, there are no real roots.",
        "2. Repeated means D=0: 10^2-4k=0, so 100-4k=0 and k=25.",
        "3. No real roots means p^2-64&lt;0. Therefore p^2&lt;64 and -8&lt;p&lt;8.",
        "4. (x-2)(x-3)&lt;0. The upward parabola is negative between roots: 2&lt;x&lt;3.",
        "5. (x+1)(2x-3)&gt;=0. The upward parabola is non-negative outside: x&lt;=-1 or x&gt;=3/2.",
    ]),
    ("C", "Functions", [
        "1. f(-2)=3(-2)-2=-6-2=-8.",
        "2. f(a+1)=3(a+1)-2=3a+3-2=3a+1.",
        "3. fg(x)=f(x^2+4)=3(x^2+4)-2=3x^2+10.",
        "4. gf(x)=g(3x-2)=(3x-2)^2+4=9x^2-12x+8.",
        "5. y=3x-2; swap: x=3y-2; y=(x+2)/3, so f^-1(x)=(x+2)/3. g is not one-to-one because g(t)=g(-t).",
    ]),
    ("D", "Coordinate geometry", [
        "1. m=(9-1)/(4-(-2))=8/6=4/3.",
        "2. Midpoint=((-2+4)/2,(1+9)/2)=(1,5).",
        "3. Changes are 6 and 8: distance=sqrt(6^2+8^2)=10.",
        "4. Through A with m=4/3: y-1=(4/3)(x+2), so y=(4/3)x+11/3.",
        "5. Perpendicular m=-3/4 through midpoint (1,5): y-5=(-3/4)(x-1).",
    ]),
    ("E", "Circles", [
        "1. (x-2)^2+(y+3)^2=25. Centre (2,-3), radius 5.",
        "2. At P: (5-2)^2+(1+3)^2=3^2+4^2=25, so P lies on C.",
        "3. Radius gradient=(1-(-3))/(5-2)=4/3, so tangent m=-3/4. y-1=(-3/4)(x-5), or 3x+4y=19.",
        "4. Set y=-3: (x-2)^2=25, so x=7 or -3. Points (7,-3) and (-3,-3).",
        "5. Centre (-1,2), radius 3: (x+1)^2+(y-2)^2=9.",
    ]),
]


def make_practice():
    s = cover("P1 DAY 6 REVISION PRACTICE", "Questions, then easy solutions", "Twenty-five questions across all four foundation topics", "Complete the question section without notes, then use the back section to understand and correct every answer.", "Keep the solution section closed until every question has an attempt. Show working. Mark in another colour and write the first wrong step.")
    s += page_title("Instructions", "How to complete this booklet", "Suggested time: 90 minutes questions, then 45 minutes marking.")
    s += [table([["Stage", "Action"], ["Questions", "Complete Sections A-E without notes."], ["Mark", "Use the easy solutions only after all questions are attempted."], ["Correct", "Circle the first wrong line and state the correct rule."], ["Retest", "Redo every incorrect question from a blank page tomorrow."]], [38*mm,136*mm]), Spacer(1,9),callout("Target","22-25 correct: secure. 18-21: repair specific gaps. 14-17: reteach two weakest topics. Below 14: return to the notes booklet before retesting.",BLUE_LIGHT,BLUE),PageBreak()]
    for letter,title,qs in QUESTIONS:
        s += page_title(f"Section {letter}", title, "Show every important step.")
        for item in qs:
            if item.startswith("Let ") or item.startswith("Points ") or item.startswith("Circle "):
                s += [callout("Given", item, TEAL_LIGHT, TEAL), Spacer(1,4)]
            else:
                s += [P(item,"Question"),RuledLines(29*mm),Spacer(1,3)]
        s += [PageBreak()]
    s += page_title("Solutions", "Open only after completing Sections A-E", "Read one line, compare one line, then correct without copying.")
    s += [callout("Easy explanation rule", "Each solution names the essential move. If your first move was different, write the missing rule before reading further.", ORANGE_LIGHT, ORANGE),Spacer(1,10),answer_box("My score before corrections: ____ / 25",35*mm),PageBreak()]
    for idx,(letter,title,answers) in enumerate(SOLUTIONS):
        s += page_title(f"Solutions {letter}", title)
        rows=[["Q","Easy working and answer"]]+[[str(i+1),a] for i,a in enumerate(answers)]
        s += [table(rows,[17*mm,157*mm]),Spacer(1,8),callout("Correction task","Close the solutions and redo every incorrect question from the beginning. Do not copy the model.",GREEN_LIGHT,TEAL)]
        if idx<len(SOLUTIONS)-1:s += [PageBreak()]
    s += [PageBreak()] + page_title("Final correction", "What must change next time", "The first wrong step is the useful information.")
    s += [table([["Q","First wrong step","Error type","Correct rule"]]+[["","","",""] for _ in range(7)],[18*mm,63*mm,34*mm,59*mm],heights=[9*mm]+[22*mm]*7),Spacer(1,8),answer_box("Three rules I can now explain without notes:",35*mm),Spacer(1,7),callout("Send for review","Send the completed question pages and correction page. Ask for three follow-up questions from the weakest topic.",BLUE_LIGHT,BLUE)]
    build(str(PRACTICE), "P1 Day 6 Practice and Easy Solutions", "Revision practice through P1 Day 6", "Rohan Study System | P1 Day 6 Practice", s)


if __name__ == "__main__":
    make_notes()
    make_practice()
    print(NOTES)
    print(PRACTICE)
