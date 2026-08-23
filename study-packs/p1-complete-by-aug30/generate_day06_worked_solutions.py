from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SHARED = ROOT / "tmp/pdfs/next-three/build_next_three_packs.py"
ns = {}
exec(SHARED.read_text().split("# P1 DAY 4")[0], ns)
globals().update(ns)

OUT = ROOT / "output/pdf/p1-complete-by-aug30/04b-p1-day06-checkpoint-worked-solutions.pdf"


def step(text):
    return bullet(text)


def part(title, method, steps, answer, marks, mistake):
    items = [P(title, "H2x"), callout("Choose the method", method, BLUE_LIGHT, BLUE)]
    items += [step(x) for x in steps]
    items += [callout(f"Final answer - {marks} marks", answer, GREEN_LIGHT, TEAL),
              callout("Common mistake", mistake, ORANGE_LIGHT, ORANGE), Spacer(1, 6)]
    return items


def make_pdf():
    s = cover(
        "P1 DAY 6 CHECKPOINT - WORKED SOLUTIONS",
        "Understand every answer",
        "Quadratics, functions, coordinate geometry and circles",
        "Follow every solution from method choice to final answer, then repair your own first wrong step.",
        "Open this only after completing the checkpoint. Compare one line at a time. If your first wrong line differs, stop copying and write the missing rule in your correction log.",
    )
    s += page_title("How to use", "Marking that produces learning", "The final answer matters less than locating the first broken step.")
    s += [table([
        ["Pass", "Action"],
        ["1. Compare", "Put your work beside the worked solution."],
        ["2. Locate", "Circle the first line where the two methods differ."],
        ["3. Classify", "Label it: concept, formula, algebra, sign, notation or checking."],
        ["4. Repair", "Write the correct rule without copying the full model."],
        ["5. Redo", "Close this booklet and solve the entire part again."],
    ], [34*mm, 140*mm]), Spacer(1, 9),
        callout("Mark codes", "M means a method mark, A means an accuracy mark after a valid method, and B means an independent fact or statement.", TEAL_LIGHT, TEAL),
        Spacer(1, 9), table([["Question", "Topic", "Marks"], ["1", "Core quadratics", "8"], ["2", "Roots and discriminant", "8"], ["3", "Inequalities and parameters", "8"], ["4", "Functions", "10"], ["5", "Coordinate geometry", "12"], ["6", "Circles", "14"], ["Total", "", "60"]], [35*mm, 105*mm, 34*mm]), PageBreak()]

    s += page_title("Question 1", "Core quadratic skills", "Expand, complete the square and use the completed form.")
    s += part("1(a) Expand (2x-3)(x+4).", "Multiply every term in the first bracket by every term in the second.",
              ["2x times x gives 2x^2.", "2x times 4 gives 8x.", "-3 times x gives -3x.", "-3 times 4 gives -12.", "Combine the middle terms: 8x-3x=5x."],
              "2x^2+5x-12. Award M1 for a correct expansion structure and A1 for simplification.", "2",
              "Multiplying only the first terms and last terms. Four products are required.")
    s += part("1(b) Complete the square: x^2-8x+11.", "Half the x coefficient, square it, then compensate outside the bracket.",
              ["Half of -8 is -4, so begin with (x-4)^2.", "Expanding (x-4)^2 gives x^2-8x+16.", "We need +11, not +16, so subtract 5."],
              "x^2-8x+11=(x-4)^2-5. M1 for the correct bracket and A1 for -5.", "2",
              "Writing (x-8)^2. The number inside is half the x coefficient.")
    s += part("1(c) State the turning point.", "Read the vertex directly from y=(x-a)^2+b.",
              ["The square is smallest when x-4=0, so x=4.", "At that point, the square is zero and y=-5."],
              "Turning point (4,-5). Award B1.", "1",
              "Using (4,5). The constant outside the square keeps its sign.")
    s += [PageBreak()] + page_title("Question 1 continued", "Exact roots")
    s += part("1(d) Solve x^2-8x+11=0 exactly.", "Use the completed-square form from part (b).",
              ["Set (x-4)^2-5=0.", "Add 5: (x-4)^2=5.", "Square-root both sides: x-4=+-sqrt(5).", "Add 4 to both sides."],
              "x=4+sqrt(5) or x=4-sqrt(5). Award M1 for isolating the square and A1+A1 for both exact roots.", "3",
              "Forgetting the negative square root. Squaring hides two possible values.")
    s += [PageBreak()]

    s += page_title("Question 2", "Roots and the discriminant", "Factor when possible; use D=b^2-4ac to describe roots.")
    s += part("2(a) Solve 3x^2-7x-6=0.", "Factorise by finding numbers with product 3(-6)=-18 and sum -7.",
              ["The numbers are -9 and +2.", "Split the middle term: 3x^2-9x+2x-6=0.", "Group: 3x(x-3)+2(x-3)=0.", "Factor: (3x+2)(x-3)=0.", "Set each bracket equal to zero."],
              "x=-2/3 or x=3. Award M1 for a valid factorisation and A1 for each root.", "3",
              "Turning 3x+2=0 into x=-2. Divide by 3.")
    s += part("2(b) State and interpret the discriminant.", "Recall the expression inside the square root of the quadratic formula.",
              ["For ax^2+bx+c, the discriminant is D=b^2-4ac.", "If D=0, sqrt(D)=0, so the plus and minus formula gives the same answer."],
              "D=b^2-4ac. D=0 means one repeated real root; the graph touches the x-axis. Award B1+B1.", "2",
              "Saying there are no roots. No real roots occurs when D&lt;0.")
    s += [PageBreak()] + page_title("Question 2 continued", "Repeated-root parameter")
    s += part("2(c) Find k for a repeated root in x^2+6x+k=0.", "A repeated root means set the discriminant equal to zero.",
              ["Here a=1, b=6 and c=k.", "D=6^2-4(1)(k)=36-4k.", "Set 36-4k=0.", "Therefore 4k=36 and k=9."],
              "k=9. Award M1 for D=0, A1 for substitution and A1 for solving.", "3",
              "Using b=6x. The coefficient b is the number 6, not the term 6x.")
    s += [PageBreak()]

    s += page_title("Question 3", "Inequalities and a parameter", "Find boundary roots, then select regions using the parabola's sign.")
    s += part("3(a) Solve x^2-x-12&lt;0.", "Factorise, mark the roots, and use the upward-opening shape.",
              ["x^2-x-12=(x-4)(x+3).", "The boundary roots are x=4 and x=-3.", "The coefficient of x^2 is positive, so the parabola is below the axis between its roots.", "The inequality is strict, so do not include the endpoints."],
              "-3&lt;x&lt;4. Award M1 for roots, A1 for the correct region and A1 for strict endpoints.", "3",
              "Choosing the outside regions. An upward-opening quadratic is negative between distinct roots.")
    s += part("3(b) Solve 2x^2+5x-3&gt;=0.", "Factorise, then choose where the upward-opening parabola is on or above the axis.",
              ["2x^2+5x-3=(2x-1)(x+3).", "The roots are x=1/2 and x=-3.", "An upward-opening parabola is non-negative outside the roots.", "The symbol &gt;= includes both roots."],
              "x&lt;=-3 or x&gt;=1/2. Award M1 for roots, A1 for regions and A1 for included endpoints.", "3",
              "Writing -3&lt;=x&lt;=1/2. That is the region where the quadratic is non-positive.")
    s += [PageBreak()] + page_title("Question 3 continued", "No-real-root parameter")
    s += part("3(c) Find p if x^2+px+9=0 has no real roots.", "No real roots means the discriminant must be negative.",
              ["Here a=1, b=p and c=9.", "D=p^2-4(1)(9)=p^2-36.", "Require p^2-36&lt;0, so p^2&lt;36.", "Values whose square is below 36 lie between -6 and 6."],
              "-6&lt;p&lt;6. Award M1 for D&lt;0 and A1 for the interval.", "2",
              "Writing p&lt;6 only. Negative values below -6 also have squares greater than 36.")
    s += [PageBreak()]

    s += page_title("Question 4", "Functions, composites and inverses", "Given f(x)=2x-5 and g(x)=x^2+1.")
    s += part("4(a) Find f(-3).", "Substitute -3 in brackets wherever x appears.",
              ["f(-3)=2(-3)-5.", "2(-3)=-6, then -6-5=-11."],
              "f(-3)=-11. Award B1.", "1", "Dropping the negative sign because the input was not placed in brackets.")
    s += part("4(b) Find fg(x).", "fg(x)=f(g(x)); apply g first, then feed its output into f.",
              ["g(x)=x^2+1.", "Replace the input of f by x^2+1: f(g(x))=2(x^2+1)-5.", "Expand and simplify: 2x^2+2-5=2x^2-3."],
              "fg(x)=2x^2-3. Award M1 for correct order and A1 for simplification.", "2", "Calculating g(f(x)). Composite order matters.")
    s += part("4(c) Find gf(x).", "gf(x)=g(f(x)); apply f first, then square the entire result inside g.",
              ["f(x)=2x-5.", "g(f(x))=(2x-5)^2+1.", "Expand: (2x-5)^2=4x^2-20x+25.", "Add 1: 4x^2-20x+26."],
              "gf(x)=4x^2-20x+26. Award M1 for substitution and A1 for expansion.", "2", "Writing 4x^2+25. The middle term -20x is essential.")
    s += [PageBreak()] + page_title("Question 4 continued", "Equations, inverses and one-to-one functions")
    s += part("4(d) Solve fg(x)=15.", "Use the expression found in part (b).",
              ["2x^2-3=15.", "Add 3: 2x^2=18.", "Divide by 2: x^2=9.", "Therefore x=+-3."],
              "x=-3 or x=3. Award M1 for the equation and A1 for both roots.", "2", "Giving only x=3. Both signs solve x^2=9.")
    s += part("4(e) Find f inverse.", "Undo the operations of f in reverse order.",
              ["Write y=2x-5.", "Swap x and y: x=2y-5.", "Add 5: x+5=2y.", "Divide by 2: y=(x+5)/2."],
              "f^-1(x)=(x+5)/2. Award M1 for rearrangement and A1.", "2", "Writing 1/(2x-5). An inverse function is not a reciprocal.")
    s += part("4(f) Explain why g has no inverse on all real numbers.", "An inverse function requires the original function to be one-to-one.",
              ["For g(x)=x^2+1, opposite inputs give the same output.", "For example, g(1)=2 and g(-1)=2.", "One output would therefore map back to two inputs."],
              "g is not one-to-one on all real numbers. Award B1.", "1", "Saying only 'because it is quadratic' without explaining the repeated outputs.")
    s += [PageBreak()]

    s += page_title("Question 5", "Coordinate geometry", "A=(2,-1) and B=(8,7).")
    s += part("5(a) Find the gradient of AB.", "Use change in y divided by change in x in the same point order.",
              ["m=(7-(-1))/(8-2).", "The numerator is 8 and denominator is 6.", "Simplify 8/6 to 4/3."],
              "Gradient 4/3. Award M1 for the formula and A1.", "2", "Using 7-1 instead of 7-(-1). Subtracting a negative becomes addition.")
    s += part("5(b) Find the midpoint.", "Average the x-coordinates and y-coordinates separately.",
              ["x midpoint=(2+8)/2=5.", "y midpoint=(-1+7)/2=3."],
              "Midpoint (5,3). Award B1.", "1", "Finding the change (6,8) instead of the midpoint.")
    s += part("5(c) Find the exact length AB.", "Use Pythagoras on the horizontal and vertical changes.",
              ["Horizontal change=8-2=6.", "Vertical change=7-(-1)=8.", "AB=sqrt(6^2+8^2)=sqrt(36+64)=sqrt(100)."],
              "AB=10. Award M1 for the distance calculation and A1.", "2", "Adding 6+8. Distance is the hypotenuse, not the sum of perpendicular changes.")
    s += [PageBreak()] + page_title("Question 5 continued", "Line and perpendicular bisector")
    s += part("5(d) Find equation AB.", "Use y-y1=m(x-x1) with m=4/3 and either point.",
              ["Using A=(2,-1): y-(-1)=(4/3)(x-2).", "So y+1=(4/3)x-8/3.", "Subtract 1: y=(4/3)x-11/3."],
              "y=(4/3)x-11/3. Equivalent: 4x-3y-11=0. Award M1+A1+A1.", "3", "Substituting x=2, y=+1. Point A has y=-1.")
    s += part("5(e) Find the perpendicular bisector.", "A perpendicular bisector passes through the midpoint and has negative reciprocal gradient.",
              ["AB has gradient 4/3, so perpendicular gradient is -3/4.", "The midpoint is (5,3).", "Use point-gradient form: y-3=(-3/4)(x-5).", "An equivalent integer form is 3x+4y=27."],
              "y-3=(-3/4)(x-5), or 3x+4y=27. Award one mark for each required idea and correct equation.", "4", "Using point A or B. A bisector must pass through the midpoint.")
    s += [PageBreak()]

    s += page_title("Question 6", "Circles and tangents", "Circle C: x^2+y^2-6x+4y-12=0.")
    s += part("6(a) Complete both squares.", "Group x-terms and y-terms, complete each square, then move the constant.",
              ["x^2-6x=(x-3)^2-9.", "y^2+4y=(y+2)^2-4.", "Substitute: (x-3)^2-9+(y+2)^2-4-12=0.", "The constants total -25, so move them right."],
              "(x-3)^2+(y+2)^2=25. Award M1+M1+A1.", "3", "Reading centre signs before completing the equation carefully.")
    s += part("6(b) State centre and radius.", "Compare with (x-a)^2+(y-b)^2=r^2.",
              ["x-3 gives centre x=3.", "y+2 means y-(-2), so centre y=-2.", "r^2=25, so r=5."],
              "Centre (3,-2), radius 5. Award B1+B1.", "2", "Giving centre (3,2). The sign inside the y bracket reverses.")
    s += part("6(c) Show P=(6,2) lies on C.", "Substitute P into the completed-square equation.",
              ["(6-3)^2+(2+2)^2.", "This is 3^2+4^2=9+16=25.", "It equals the right side, so P satisfies the circle equation."],
              "P lies on C. Award M1 for substitution and A1 for the demonstrated equality.", "2", "Writing only 'yes'. The question says show, so the substitution must appear.")
    s += [PageBreak()] + page_title("Question 6 continued", "Radius, tangent and intersections")
    s += part("6(d) Find the radius gradient.", "Use centre (3,-2) and P=(6,2).",
              ["m=(2-(-2))/(6-3).", "This is 4/3."],
              "Radius gradient 4/3. Award M1+A1.", "2", "Using the radius length 5 as the gradient.")
    s += part("6(e) Find the tangent at P.", "The tangent is perpendicular to the radius and passes through P.",
              ["Radius gradient=4/3, so tangent gradient=-3/4.", "Use P=(6,2): y-2=(-3/4)(x-6).", "Multiply by 4: 4y-8=-3x+18.", "Rearrange: 3x+4y=26."],
              "y-2=(-3/4)(x-6), or 3x+4y=26. Award M1+M1+A1.", "3", "Using the centre in the tangent equation. The tangent passes through P, not the centre.")
    s += part("6(f) Intersections with y=-2.", "Substitute the line into the circle equation.",
              ["In (x-3)^2+(y+2)^2=25, set y=-2.", "Then (y+2)^2=0, so (x-3)^2=25.", "x-3=+-5, giving x=8 or x=-2."],
              "The points are (8,-2) and (-2,-2). Award M1 for the equation and A1 for both points.", "2", "Reporting only x-values. The question asks for points, so include y=-2.")
    s += [PageBreak()]

    s += page_title("Correction sheet", "Turn the checkpoint into progress", "Complete this before moving to the next topic.")
    s += [table([["Q/part", "My first wrong line", "Error type", "Correct rule"]]+[["", "", "", ""] for _ in range(6)], [25*mm, 65*mm, 34*mm, 50*mm], heights=[9*mm]+[20*mm]*6), Spacer(1, 6),
          table([["Topic", "Score", "Available", "%"], ["Quadratics", "", "24", ""], ["Functions", "", "10", ""], ["Coordinate geometry", "", "12", ""], ["Circles", "", "14", ""], ["Total", "", "60", ""]], [75*mm, 31*mm, 37*mm, 31*mm]), Spacer(1, 8),
          callout("Retest rule", "For every topic below 80%, close this booklet and solve three new questions. For every topic below 60%, reread the relevant notes before the retest.", ORANGE_LIGHT, ORANGE),
          Spacer(1, 5), answer_box("The three rules I must remember next time:", 20*mm)]
    build(str(OUT), "P1 Day 6 Checkpoint Worked Solutions", "Worked solutions for the P1 Day 6 checkpoint", "Rohan Study System | P1 Day 6 Worked Solutions", s)


if __name__ == "__main__":
    make_pdf()
    print(OUT)
