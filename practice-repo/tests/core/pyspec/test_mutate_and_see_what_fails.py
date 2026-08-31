"""
CHAINPATH-GENERATED-SCAFFOLD

Practice: protocol-consensus-specs-mutate-and-see-what-fails  (break, grain block, difficulty 4)
Run:      uv run pytest tests/core/pyspec --preset minimal -q --junitxml=out/results.xml

THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
resolves and fails honestly, with one named case per acceptance criterion, instead of
reporting "the test path may not exist" — which is a broken harness, not a red test.

Replace each placeholder with a real assertion as you go. A criterion you have actually
tested no longer needs its placeholder. Delete this notice when none remain.

What the practice asks for:
  With the pyspec built, introduce exactly one mutation into the specification's own source —
  a changed divisor in a penalty calculation, or a reordering of two steps inside epoch
  processing. Rebuild and run the reference test suite for that fork. Record which test
  vectors fail, in which categories, and with what kind of mismatch. Then answer in writing:
  would this mutation, shipped in a real client, cause a chain split, a slashing event, or
  nothing observable? Repeat with a second mutation chosen so that it fails a different
  category of vector than the first. Finally, make a mutation you predict will fail nothing,
  run the suite, and explain what that says about test coverage.
"""

# out/results.xml from the unmutated build is green, establishing a clean baseline before any
# mutation
def test_criterion_01_out_results_xml_from_the_unmutated_build():
    raise AssertionError("out/results.xml from the unmutated build is green, establishing a clean baseline before any mutation")


# Each mutation run records the failing vector names and categories, and the two chosen
# mutations fail different categories
def test_criterion_02_each_mutation_run_records_the_failing_vector():
    raise AssertionError("Each mutation run records the failing vector names and categories, and the two chosen mutations fail different categories")


# A written analysis states, per mutation, whether a client shipping it would split the chain,
# get its validators slashed, or diverge invisibly
def test_criterion_03_a_written_analysis_states_per_mutation_whether():
    raise AssertionError("A written analysis states, per mutation, whether a client shipping it would split the chain, get its validators slashed, or diverge invisibly")


# The deliberately-undetected mutation is documented with an argument about what the vector
# corpus does not cover
def test_criterion_04_the_deliberately_undetected_mutation_is_documented_with():
    raise AssertionError("The deliberately-undetected mutation is documented with an argument about what the vector corpus does not cover")
