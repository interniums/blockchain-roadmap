# Incident 01: TODO name the incident

<!-- Rename this file to something descriptive, e.g. 02-medalla-stall.md -->
<!-- Delete every TODO before you consider this done. -->

## Summary

TODO. Two or three sentences. What was observed, when, and by whom.

Do not write "the chain went down". If you catch yourself reaching for it, the
next section is the one you have not done yet.

## Primary source

TODO. A post-mortem from the team involved, or a client release note. Link it
and name it. A news article summarising a post-mortem is not a primary source.

- Title: TODO
- Author or team: TODO
- Link: TODO

## Observable evidence

TODO. What could actually be seen, and where. Block numbers, tag values,
timestamps, error messages, participation rates. Concrete artifacts, not
adjectives.

## What was violated

TODO. Name the property explicitly and name whose guarantee it was.

- Property: TODO — safety, liveness, or neither
- Whose guarantee: TODO — the protocol's, one client's, one rollup's, one
  provider's
- What a user could no longer rely on: TODO

## Classification

TODO: safety failure / liveness failure / neither.

State the reasoning in terms of the definitions:

- Safety means two conflicting things were both finalised.
- Liveness means nothing progressed.
- Neither means something else broke, and you should say what.

## The strongest counter-reading

TODO. State the best argument for classifying this differently, fairly enough
that someone who holds it would recognise it. Then answer it.

A counter-reading you have made easy to knock down has taught you nothing.

## Could a user have detected this from one RPC endpoint

TODO: yes or no, and how.

If yes, say exactly which call and what the response would have looked like.
If no, say what a single endpoint would have shown instead — usually something
reassuring and wrong.
