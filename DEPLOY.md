# 🚀 DEPLOY IT YOURSELF — 5 minutes

## What to do (Vercel, same as your Resonate site)
1. Push anything you changed on the branch `arena/01a03de8-rakshbandhan` (or merge it on GitHub yourself — your call).
2. [vercel.com](https://vercel.com) → **Add New → Project** → import `UCHIHA-MADARA-ANUJ/Rakshbandhan`.
3. Framework: **Next.js** (auto-detected). No env vars needed. Click **Deploy**.
   - Deploying the branch directly? Vercel → project → *Deployments* → ⋯ on the branch deployment → **Promote to Production**.
4. Send her the production link with:

   > *"akela kholna. sound ON. intro skip mat karna. trust me."*

## Where everything lives (edit BEFORE deploying if you want)
| What | File |
|---|---|
| **Every word on the site** | `app/content.js` ← change anything here |
| Song volume (0.3 = low) | `app/audio.js` → `musicVol = 0.3` |
| The song file | `public/audio/music.mp3` |
| Her pics (**dossier only**, your rule) | `public/assets/photos/` (7 exhibit webps) |
| Intro film lines | `app/content.js` → `INTRO.beats` |
| Gate answers (dayan / chudail) | `app/content.js` → `GATE` |

## Test on your phone before sending
`/` → tap to begin → 30s film → type `dayan` → walk all 10 routes → tie the rakhi on `/ritual` → tap the heart on `/love`.

## Notes
- Site is `noindex` + unlisted by default (robots blocked). Keep the link between you two (song copyright + it's her gift).
- Old photos from earlier versions still exist in **git history** on GitHub. If you want them gone from the internet: `git filter-repo --invert-paths --path pics --force` then force-push (or make the repo private — easiest).
- The 30 photos NOT in the dossier were deleted on purpose (your rule). To re-add any: drop a webp in `public/assets/photos/` + add one line in `FILE.exhibits`.

— built at 2am, ek hi chand 🌙
