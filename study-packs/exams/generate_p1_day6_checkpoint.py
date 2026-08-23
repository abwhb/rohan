from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SHARED = ROOT / "tmp/pdfs/next-three/build_next_three_packs.py"
ns = {}
exec(SHARED.read_text().split("# P1 DAY 4")[0], ns)
globals().update(ns)

OUT = ROOT / "output/pdf/exams"
PAPER = OUT / "p1-checkpoint-after-day-06-question-paper.pdf"
MARKS = OUT / "p1-checkpoint-after-day-06-mark-scheme.pdf"


def qhead(number, title, marks):
    return [P(f"QUESTION {number}", "Kicker"), P(title, "H2x"), P(f"[{marks} marks]", "Smallx")]


def part(text, marks, height=24*mm):
    return [P(f"{text}  <b>[{marks}]</b>", "Question"), RuledLines(height), Spacer(1, 4)]


def make_paper():
    s = cover(
        "AS MATHEMATICS - PURE 1 - CHECKPOINT",
        "P1 exam: Days 1-6",
        "Quadratics, functions, coordinate geometry and circles",
        "Complete a 60-mark, 75-minute closed-book exam and show every essential step.",
        "No notes and no answer sheet. A calculator is allowed. Give exact answers unless a decimal is requested. If stuck, write a relevant formula and continue.",
    )
    s += page_title("Instructions", "Before you begin", "This paper is designed to show what to repair next, not merely produce a score.")
    s += [table([
        ["Item", "Requirement"],
        ["Time", "75 minutes"], ["Total", "60 marks"],
        ["Topics", "Quadratics; discriminant and inequalities; functions; straight lines; circles"],
        ["Method", "Show algebra, substitutions and equations. Unsupported answers may lose method marks."],
        ["Finish", "Check signs, brackets, exact values and whether every part was attempted."],
    ], [35*mm, 139*mm]), Spacer(1, 10),
        callout("Teacher setup", "Print only this question paper for Rohan. Keep the separate mark scheme closed until the full 75 minutes have ended.", ORANGE_LIGHT, ORANGE),
        Spacer(1, 12), P("Student declaration", "H2x"),
        P("I completed this paper without notes or answers.", "Bodyx"),
        P("Signature: ____________________________    Start: __________    Finish: __________", "Bodyx"),
        Spacer(1, 12), P("Score record", "H2x"),
        table([["Quadratics /24", "Functions /10", "Coordinates /12", "Circles /14", "Total /60"], ["", "", "", "", ""]], [35*mm]*4+[34*mm], heights=[10*mm, 25*mm]), PageBreak()]

    s += page_title("Section A", "Quadratics", "Questions 1-3 test algebra, roots, graphs and parameter reasoning.")
    s += qhead(1, "Core quadratic skills", 8)
    s += part("(a) Expand and simplify (2x - 3)(x + 4).", 2, 12*mm)
    s += part("(b) Complete the square: x^2 - 8x + 11.", 2, 14*mm)
    s += part("(c) Hence state the coordinates of the turning point of y=x^2-8x+11.", 1, 11*mm)
    s += part("(d) Solve x^2 - 8x + 11=0, giving exact answers.", 3, 18*mm)
    s += qhead(2, "Roots and the discriminant", 8)
    s += part("(a) Solve 3x^2 - 7x - 6=0.", 3, 17*mm)
    s += part("(b) State the discriminant of ax^2+bx+c and explain what a zero discriminant means.", 2, 15*mm)
    s += part("(c) Find k if x^2+6x+k=0 has a repeated root.", 3, 17*mm)
    s += [PageBreak()]

    s += page_title("Section A continued", "Quadratic inequalities and parameters", "Use roots and the shape of the parabola.")
    s += qhead(3, "Inequalities and a parameter", 8)
    s += part("(a) Solve x^2-x-12&lt;0.", 3, 34*mm)
    s += part("(b) Solve 2x^2+5x-3&gt;=0.", 3, 36*mm)
    s += part("(c) Find the set of values of p for which x^2+px+9=0 has no real roots.", 2, 35*mm)
    s += [callout("Checkpoint", "You have completed 24 marks. Suggested elapsed time: 30 minutes.", BLUE_LIGHT, BLUE), PageBreak()]

    s += page_title("Section B", "Functions", "Read composites from the inside and reverse operations for inverses.")
    s += qhead(4, "Functions, composites and inverses", 10)
    s += [callout("Given", "f(x)=2x-5 and g(x)=x^2+1, for real x.", TEAL_LIGHT, TEAL), Spacer(1, 7)]
    s += part("(a) Find f(-3).", 1, 15*mm)
    s += part("(b) Find fg(x), simplifying your answer.", 2, 24*mm)
    s += part("(c) Find gf(x), simplifying your answer.", 2, 27*mm)
    s += part("(d) Solve fg(x)=15.", 2, 24*mm)
    s += part("(e) Find f inverse of x.", 2, 22*mm)
    s += part("(f) Explain why g does not have an inverse function when its domain is all real numbers.", 1, 23*mm)
    s += [PageBreak()]

    s += page_title("Section C", "Coordinate geometry", "Build equations from gradients and points.")
    s += qhead(5, "Straight lines and perpendicular geometry", 12)
    s += [callout("Given", "A=(2,-1) and B=(8,7).", TEAL_LIGHT, TEAL), Spacer(1, 7)]
    s += part("(a) Find the gradient of AB.", 2, 20*mm)
    s += part("(b) Find the midpoint of AB.", 1, 18*mm)
    s += part("(c) Find the exact length AB.", 2, 24*mm)
    s += part("(d) Find an equation of line AB in the form y=mx+c.", 3, 29*mm)
    s += part("(e) Find an equation of the perpendicular bisector of AB.", 4, 43*mm)
    s += [PageBreak()]

    s += page_title("Section D", "Circles", "Use completed-square form and radius-tangent geometry.")
    s += qhead(6, "Circle equations and a tangent", 14)
    s += [callout("Given", "Circle C has equation x^2+y^2-6x+4y-12=0.", TEAL_LIGHT, TEAL), Spacer(1, 6)]
    s += part("(a) Write the equation in the form (x-a)^2+(y-b)^2=r^2.", 3, 20*mm)
    s += part("(b) State the centre and radius of C.", 2, 15*mm)
    s += part("(c) Show that P=(6,2) lies on C.", 2, 17*mm)
    s += part("(d) Find the gradient of the radius from the centre to P.", 2, 15*mm)
    s += part("(e) Hence find the equation of the tangent to C at P.", 3, 22*mm)
    s += part("(f) Find the two points where C meets the line y=-2.", 2, 20*mm)
    s += [callout("End of paper", "Stop after 75 minutes. Check every page, then send the complete paper for marking before viewing the mark scheme.", GREEN_LIGHT, TEAL)]
    build(str(PAPER), "P1 Checkpoint after Day 6 - Question Paper", "AS Pure Mathematics 1 checkpoint", "Rohan Study System | P1 checkpoint after Day 6", s)


def mark_row(part_name, answer, marks):
    return [part_name, answer, marks]


def make_marks():
    s = cover(
        "TEACHER COPY - MARK SCHEME",
        "P1 exam: Days 1-6",
        "60 marks with method guidance and diagnostic bands",
        "Mark consistently, identify the first wrong step, and turn the result into the next study priorities.",
        "Do not give this document to Rohan before the exam is complete. Award method marks when a correct method is clearly shown, even after a numerical slip.",
    )
    s += page_title("Marking principles", "How to use this scheme", "M=method, A=accuracy, B=independent statement.")
    s += [bullet("Award an accuracy mark only when the required preceding method is present, unless the answer is clearly obtained correctly."),
          bullet("Accept algebraically equivalent exact forms."),
          bullet("Do not penalise the same arithmetic slip repeatedly; follow through where the method remains valid."),
          bullet("Record each error as concept, method, algebra, sign, notation or checking."),
          Spacer(1, 8), callout("Grade guide for this checkpoint", "51-60: secure A-level trajectory for these topics. 42-50: strong but repair specific gaps. 33-41: developing; reteach two weakest topics. Below 33: rebuild foundations before advancing.", BLUE_LIGHT, BLUE),
          Spacer(1, 10), table([["Topic", "Marks", "Rohan's score"], ["Quadratics", "24", ""], ["Functions", "10", ""], ["Coordinate geometry", "12", ""], ["Circles", "14", ""], ["Total", "60", ""]], [75*mm, 35*mm, 64*mm], heights=[9*mm]+[14*mm]*5), PageBreak()]

    s += page_title("Questions 1-3", "Quadratics mark scheme", "Total: 24 marks")
    rows = [["Part", "Answer and allocation", "Marks"],
            mark_row("1(a)", "2x^2+5x-12. M1 correct expansion; A1 simplified.", "2"),
            mark_row("1(b)", "(x-4)^2-5. M1 forms (x-4)^2; A1 constant -5.", "2"),
            mark_row("1(c)", "(4,-5). B1.", "1"),
            mark_row("1(d)", "x=4+-sqrt(5). M1 uses completed square or formula; A1 square-root step; A1 both exact roots.", "3"),
            mark_row("2(a)", "(3x+2)(x-3)=0, so x=-2/3 or 3. M1 factorises/uses formula; A1 each root.", "3"),
            mark_row("2(b)", "b^2-4ac; zero means one repeated real root / tangent to x-axis. B1+B1.", "2"),
            mark_row("2(c)", "36-4k=0, so k=9. M1 sets discriminant to zero; A1 substitutes; A1 solves.", "3"),
            mark_row("3(a)", "(x-4)(x+3)&lt;0, so -3&lt;x&lt;4. M1 roots; A1 correct region; A1 strict notation.", "3"),
            mark_row("3(b)", "(2x-1)(x+3)&gt;=0, so x&lt;=-3 or x&gt;=1/2. M1 roots; A1 regions; A1 endpoints included.", "3"),
            mark_row("3(c)", "p^2-36&lt;0, so -6&lt;p&lt;6. M1 discriminant condition; A1 solution.", "2")]
    s += [table(rows, [18*mm, 137*mm, 19*mm]), Spacer(1, 8), callout("Diagnostic", "If Q1 is weak: completing square/algebra. If Q2 is weak: discriminant. If Q3 is weak: roots plus parabola sign regions.", ORANGE_LIGHT, ORANGE), PageBreak()]

    s += page_title("Question 4", "Functions mark scheme", "Total: 10 marks")
    rows = [["Part", "Answer and allocation", "Marks"],
            mark_row("4(a)", "f(-3)=-11. B1.", "1"),
            mark_row("4(b)", "fg(x)=f(g(x))=2(x^2+1)-5=2x^2-3. M1 correct order; A1.", "2"),
            mark_row("4(c)", "gf(x)=g(f(x))=(2x-5)^2+1=4x^2-20x+26. M1 substitution; A1 expansion.", "2"),
            mark_row("4(d)", "2x^2-3=15, x^2=9, so x=+-3. M1 equation; A1 both roots.", "2"),
            mark_row("4(e)", "f^-1(x)=(x+5)/2. M1 reverses/rearranges; A1.", "2"),
            mark_row("4(f)", "g is not one-to-one: g(a)=g(-a), for example g(1)=g(-1). B1.", "1")]
    s += [table(rows, [18*mm, 137*mm, 19*mm]), Spacer(1, 10), callout("Diagnostic", "Wrong fg/gf order needs composite-machine practice. A wrong inverse needs swap-and-rearrange practice. Part (f) tests conceptual understanding, not calculation.", ORANGE_LIGHT, ORANGE), PageBreak()]

    s += page_title("Question 5", "Coordinate geometry mark scheme", "Total: 12 marks")
    rows = [["Part", "Answer and allocation", "Marks"],
            mark_row("5(a)", "m=(7-(-1))/(8-2)=8/6=4/3. M1 formula; A1.", "2"),
            mark_row("5(b)", "((2+8)/2,(-1+7)/2)=(5,3). B1.", "1"),
            mark_row("5(c)", "sqrt(6^2+8^2)=10. M1 distance method; A1.", "2"),
            mark_row("5(d)", "y+1=(4/3)(x-2), hence y=(4/3)x-11/3. M1 point-gradient; A1 substitution; A1 final form.", "3"),
            mark_row("5(e)", "Perpendicular gradient=-3/4 and midpoint=(5,3). y-3=(-3/4)(x-5), e.g. 3x+4y=27. M1 negative reciprocal; M1 midpoint used; A1 equation; A1 simplified equivalent.", "4")]
    s += [table(rows, [18*mm, 137*mm, 19*mm]), Spacer(1, 10), callout("Diagnostic", "Separate formula recall from sign errors. The perpendicular bisector requires both ideas: negative reciprocal gradient and midpoint.", ORANGE_LIGHT, ORANGE), PageBreak()]

    s += page_title("Question 6", "Circles mark scheme", "Total: 14 marks")
    rows = [["Part", "Answer and allocation", "Marks"],
            mark_row("6(a)", "(x-3)^2+(y+2)^2=25. M1 completes x square; M1 completes y square; A1 equation.", "3"),
            mark_row("6(b)", "Centre (3,-2), radius 5. B1+B1.", "2"),
            mark_row("6(c)", "At (6,2): (6-3)^2+(2+2)^2=9+16=25, so P lies on C. M1 substitution; A1 conclusion.", "2"),
            mark_row("6(d)", "Radius gradient=(2-(-2))/(6-3)=4/3. M1+A1.", "2"),
            mark_row("6(e)", "Tangent gradient=-3/4; y-2=(-3/4)(x-6), e.g. 3x+4y=26. M1 gradient; M1 point-gradient; A1.", "3"),
            mark_row("6(f)", "Set y=-2: (x-3)^2=25, so x=8 or -2. Points (8,-2) and (-2,-2). M1 equation; A1 both points.", "2")]
    s += [table(rows, [18*mm, 137*mm, 19*mm]), Spacer(1, 8),
          P("Correction prescription", "H2x"),
          table([["Score on topic", "Required response"], ["80% or more", "One challenge question; continue."], ["60-79%", "Redo every lost mark, then complete three targeted questions."], ["Below 60%", "Reread the relevant Day 1-6 notes, redo worked examples, then sit a short retest."]], [42*mm, 132*mm]),
          Spacer(1, 8), callout("Return for review", "Send the completed paper and this marked score grid. The next lesson should be chosen from the lowest topic percentage, not the total score alone.", GREEN_LIGHT, TEAL)]
    build(str(MARKS), "P1 Checkpoint after Day 6 - Mark Scheme", "AS Pure Mathematics 1 mark scheme", "Rohan Study System | Teacher mark scheme", s)


if __name__ == "__main__":
    make_paper()
    make_marks()
    print(PAPER)
    print(MARKS)
