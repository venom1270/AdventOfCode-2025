# AdventOfCode-2025

A bit late to the party! Completely forgot about it this year 😅. Been busy with other projects, but as they say, better late... no... a programmer is never late, he/she arrives precisely when he/she means to 🧙‍♂️. 

Since I didn't have time to prepare and think this through, I'm doing it in *Typescript*/*SvelteKit* this year. Might not be the best option, but it will be good exercise to maybe look into more TS data structures and constructs.

So yeah, nothing special this year, I'm actually delighted it's only 12 days/tasks from this year on. I will probably not be doing them every day, but there will be plenty of time during Christmas time.

So, here we go... 

## Day 1

Day 1 complete. Took me longer than I'd like to admit, got a bit confused with the math there 😅. But it was a simple enjoyable task, let's see how long that sentiment lasts! 😎

## Day 2

This on was easy. Didn't overhtink too much, did the most obvious naive solution and it works great! 😎 Takes about *100ms* or *0,1s* for part 2, which is good enough.

## Day 3

Fairly easy, no big difficulties, I think I'm getting the hand of this. Spent less time overall than on day 1 and day 2. 😎😅

## Day 4

Quickly did day 4 as well. I was dreading it was gonna be a recursion task, but luckily it wasn't! Very simple. 😀

## Day 5

Interval sorting done first try! Even I am a bit impressed with myself! 😛 But I think I spent the least time on this day haha. Seems the tasks are getting easier 😎 (*famous last words*)

## Day 6

This was pretty easy, but a bit cubersome. Have praise myself a bit - I did part 2 in first try, ignoring a stupid simple bug I found rather quickly 😎.

## Day 7

I am also kinda proud of this one! I was really contemplating doing recursion for part 2, but in the end managed to come up with a dynamic programming(*?*) solution 😎. Basically you carry a number for how many times the beams overlap all through the simulation like in part 1, and in the end just sum up the numbers (number of overalpping beams)! 😀

## Day 8

I wasted so much time on this one... a bit of unclear part 1 instructions and a bit fiddly with all the things you need to keep track of. Not hard, just a bit tedious (and I don't like those 3D space-like tasks 😅).

## Day 9

Part 1 is very easy, but I have no clue for part 2 🤔. Guess I'm leaving it for later 😅.

** UPDATE 18.12.2025**: Managed to solve it with crucial help from [@nsk4](https://github.com/nsk4)! The trick was to just check all pairs of points and see if any point on the lines is inside the proposed square, in which case it's not valid! The solution takes a bit of time, ~10+ seconds, but it's fine!

## Day 10

Damn, part 2s are giving me a hard time this year! 😅 Only managed to complete part 1 for now, part 2 needs some more wheel-turning optimization. 🤔🤔
*Part 2 reminds me of the classic "coin" leetcode task, but I forgot the details 😤*

## Day 11

This was enjoyable. Part 2 was a bit of a head-scratcher, but managed to finish it optimally (I think) 😎. The trick, that I suspected from the beginning, was to split the search in segments and then just multiply the number of possible segment paths together! 😀