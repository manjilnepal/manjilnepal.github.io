/* Conference deadlines, grouped by area. Rendered by assets/js/deadlines.js.

   Initial data (Nov 2026) came from the community-maintained ccf-deadlines
   list (github.com/ccfddl/ccf-deadlines); every venue was then checked
   against its official call for papers on 2026-11-08. Re-check the official
   call before relying on a date.

   ── Fields ──
   name, year    Shown as "CVPR 2027".
   link          Official site or call for papers.
   when, where   Conference dates and location (free text).
   tz            Time zone of the deadlines: "AoE" (UTC-12), "UTC",
                 or an offset such as "UTC-4" / "UTC+5:30".
   deadlines     One entry per submission round, each with:
                   paper     "YYYY-MM-DD HH:MM" (required)
                   abstract  "YYYY-MM-DD HH:MM" (optional)
                   label     e.g. "Round 1" (optional)
                   abstractLabel  what the call calls the early deadline,
                             e.g. "Paper enrollment" (default "Abstract")
                 Leave it empty ([]) while the deadline is not announced.
   (areas)       Each area has an id, a full name for the filters and a
                 short name shown as a tag next to each venue.
   every         Optional. 2 for venues held every other year (ICCV, ECCV);
                 default 1.
   last          Optional. The previous edition's paper deadline:
                 { paper, tz, year }. Shown in the year summary, and used to
                 estimate the next deadline while it is TBA.

   ── To add a conference ──
   Copy any { ... } block into the right area's confs list. Order does not
   matter: each area is sorted by the next upcoming deadline. To add an area,
   copy a whole { id, name, confs } block. */
window.DEADLINES = {
  updated: "2026-11-08",
  areas: [
    {
      id: "ml",
      name: "Machine Learning",
      short: "ML",
      confs: [
        {
          name: "NeurIPS",
          year: 2026,
          link: "https://neurips.cc/Conferences/2026",
          when: "December 8-10 (Sydney), December 9-11 (Atlanta and Paris), 2026",
          where: "Sydney, Australia; Atlanta, USA; Paris, France",
          tz: "UTC",
          deadlines: [
            { paper: "2026-05-07 11:59", abstract: "2026-05-05 11:59" }
          ]
        },
        {
          name: "ICML",
          year: 2027,
          link: "https://icml.cc/Conferences/2027",
          when: "July 31 - August 6, 2027",
          where: "Riocentro, Rio de Janeiro, Brazil",
          tz: "AoE",
          deadlines: [],
          last: { paper: "2026-01-29 11:59", tz: "UTC", year: 2026 }
        },
        {
          name: "ICLR",
          year: 2027,
          link: "https://iclr.cc/Conferences/2027",
          when: "April 26-30, 2027",
          where: "San Francisco, CA, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-09-25 23:59", abstract: "2026-09-18 23:59" }
          ]
        },
        {
          name: "AISTATS",
          year: 2027,
          link: "https://virtual.aistats.org/Conferences/2027",
          when: "May 3-6, 2027",
          where: "Montréal, Canada",
          tz: "AoE",
          deadlines: [
            { paper: "2026-10-06 23:59", abstract: "2026-09-29 23:59" }
          ]
        },
        {
          name: "AAAI",
          year: 2027,
          link: "https://aaai.org/conference/aaai/aaai-27/",
          when: "February 16-23, 2027",
          where: "Montréal, Québec, Canada",
          tz: "AoE",
          deadlines: [
            { paper: "2026-07-28 23:59", abstract: "2026-07-21 23:59" }
          ]
        },
        {
          name: "IJCAI",
          year: 2027,
          link: "https://2027.ijcai.org/",
          when: "August 7-13, 2027",
          where: "Kyoto, Japan",
          tz: "AoE",
          deadlines: [
            { paper: "2027-01-11 23:59", abstract: "2027-01-04 23:59" }
          ],
          last: { paper: "2026-01-19 23:59", tz: "AoE", year: 2026 }
        }
      ]
    },
    {
      id: "cv",
      name: "Computer Vision",
      short: "CV",
      confs: [
        {
          name: "CVPR",
          year: 2027,
          link: "https://cvpr.thecvf.com/Conferences/2027",
          when: "June 20-25, 2027",
          where: "Seattle, WA, United States",
          tz: "AoE",
          deadlines: [
            { paper: "2026-11-16 23:59", abstract: "2026-11-10 23:59", abstractLabel: "Paper enrollment" }
          ]
        },
        {
          name: "ICCV",
          year: 2027,
          every: 2,
          link: "https://iccv.thecvf.com/Conferences/2027",
          when: "October 2-8, 2027",
          where: "Hong Kong, China",
          tz: "AoE",
          deadlines: [],
          last: { paper: "2025-03-08 09:59", tz: "UTC", year: 2025 }
        },
        {
          name: "ECCV",
          year: 2026,
          every: 2,
          link: "https://eccv.ecva.net/",
          when: "September 10-12, 2026",
          where: "Malmö, Sweden",
          tz: "UTC-8",
          deadlines: [
            { paper: "2026-03-05 14:00", abstract: "2026-02-26 14:00" }
          ]
        },
        {
          name: "WACV",
          year: 2027,
          link: "https://wacv.thecvf.com/",
          when: "Jan 4 - 8, 2027",
          where: "Disney Springs, Buena Vista, FL, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-06-26 23:59", abstract: "2026-06-19 23:59", label: "First round" },
            { paper: "2026-08-28 23:59", abstract: "2026-08-21 23:59", label: "Second round" }
          ]
        },
        {
          name: "BMVC",
          year: 2026,
          link: "https://bmvc2026.bmva.org/",
          when: "November 23-26, 2026",
          where: "Lancaster, UK",
          tz: "AoE",
          deadlines: [
            { paper: "2026-05-29 23:59", abstract: "2026-05-22 23:59" }
          ]
        }
      ]
    },
    {
      id: "nlp",
      name: "Natural Language Processing",
      short: "NLP",
      confs: [
        {
          name: "ACL",
          year: 2027,
          link: "https://2027.aclweb.org/",
          when: "August 17-22, 2027",
          where: "Kyoto, Japan",
          tz: "AoE",
          deadlines: [
            { paper: "2027-01-04 23:59", label: "ARR submission" }
          ],
          last: { paper: "2026-01-05 23:59", tz: "AoE", year: 2026 }
        },
        {
          name: "EMNLP",
          year: 2026,
          link: "https://2026.emnlp.org/",
          when: "October 25-27, 2026",
          where: "Budapest, Hungary (Hybrid)",
          tz: "AoE",
          deadlines: [
            { paper: "2026-05-25 23:59", label: "ARR submission" },
            { paper: "2026-08-02 23:59", label: "ARR commitment" }
          ]
        },
        {
          name: "NAACL",
          year: 2027,
          link: "https://2027.naacl.org/",
          when: "June 1-5, 2027",
          where: "San Francisco, California, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-10-12 23:59", label: "ARR submission" },
            { paper: "2026-12-23 23:59", label: "ARR commitment" }
          ]
        }
      ]
    },
    {
      id: "systems",
      name: "ML Systems & Systems",
      short: "Systems",
      confs: [
        {
          name: "MLSys",
          year: 2027,
          link: "https://mlsys.org/",
          when: "June 21-25, 2027",
          where: "Bellevue, Washington, USA",
          tz: "UTC",
          deadlines: [
            { paper: "2026-10-30 21:00" }
          ]
        },
        {
          name: "OSDI",
          year: 2027,
          link: "https://www.usenix.org/conference/osdi27",
          when: "July 7-9, 2027",
          where: "Baltimore, MD, USA",
          tz: "UTC",
          deadlines: [
            { paper: "2026-12-08 22:59", abstract: "2026-12-01 22:59" }
          ]
        },
        {
          name: "SOSP",
          year: 2026,
          link: "https://sigops.org/s/conferences/sosp/2026/index.html",
          when: "September 30 - October 2, 2026",
          where: "Clarion Congress Hotel Prague, Prague, Czechia",
          tz: "AoE",
          deadlines: [
            { paper: "2026-04-01 23:59", abstract: "2026-03-26 23:59" }
          ]
        },
        {
          name: "EuroSys",
          year: 2027,
          link: "https://2027.eurosys.org/",
          when: "April 19-23, 2027",
          where: "Rabat, Morocco",
          tz: "AoE",
          deadlines: [
            { paper: "2026-05-14 23:59", abstract: "2026-05-07 23:59", label: "Spring" },
            { paper: "2026-09-24 23:59", abstract: "2026-09-17 23:59", label: "Fall" }
          ]
        },
        {
          name: "ATC",
          year: 2026,
          link: "https://sigops.org/s/conferences/atc/2026/index.html",
          when: "November 16-18, 2026",
          where: "Hyatt Hotel, Shatin, Hong Kong, China",
          tz: "UTC",
          deadlines: [
            { paper: "2026-06-11 11:59" }
          ]
        },
        {
          name: "ASPLOS",
          year: 2027,
          link: "https://www.asplos-conference.org/asplos2027/cfp/",
          when: "April 11-15, 2027",
          where: "Crete, Greece",
          tz: "AoE",
          deadlines: [
            { paper: "2026-04-15 23:59", label: "April Cycle" },
            { paper: "2026-09-09 23:59", label: "September Cycle" }
          ]
        },
        {
          name: "NSDI",
          year: 2028,
          link: "https://www.usenix.org/conferences/byname/178",
          when: "May 9-11, 2028",
          where: "Santa Clara, CA, USA",
          tz: "UTC-7",
          deadlines: [],
          last: { paper: "2026-04-23 23:59", tz: "UTC-4", year: 2027 }
        },
        {
          name: "SoCC",
          year: 2026,
          link: "https://acmsocc.org/2026/",
          when: "November 18-20, 2026",
          where: "Singapore",
          tz: "AoE",
          deadlines: [
            { paper: "2026-02-13 23:59", abstract: "2026-02-06 23:59", label: "First round" },
            { paper: "2026-07-14 23:59", abstract: "2026-07-07 23:59", label: "Second round" }
          ]
        }
      ]
    },
    {
      id: "hpc",
      name: "HPC & Distributed Computing",
      short: "HPC",
      confs: [
        {
          name: "SC",
          year: 2026,
          link: "https://sc26.supercomputing.org/",
          when: "November 16-20, 2026",
          where: "McCormick Place, Chicago, Illinois, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-04-08 23:59", abstract: "2026-04-01 23:59" }
          ]
        },
        {
          name: "HPDC",
          year: 2026,
          link: "https://hpdc.sci.utah.edu/2026/",
          when: "July 14-16, 2026",
          where: "Cleveland, OH, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-02-05 23:59", abstract: "2026-01-29 23:59" }
          ]
        },
        {
          name: "IPDPS",
          year: 2027,
          link: "https://www.ipdps.org/",
          when: "June 1-5, 2027",
          where: "Seattle, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-10-08 23:59", abstract: "2026-10-01 23:59" }
          ]
        },
        {
          name: "PPoPP",
          year: 2027,
          link: "https://ppopp27.sigplan.org/",
          when: "Mar 20-24, 2027",
          where: "Salt Lake City, Utah, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-08-03 23:59" }
          ]
        },
        {
          name: "CCGrid",
          year: 2027,
          link: "https://hpcclab.org/ccgrid27/",
          when: "May 24-27, 2027",
          where: "Dallas-Fort Worth, Texas, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-12-01 23:59", abstract: "2026-11-24 23:59" }
          ]
        },
        {
          name: "ICDCS",
          year: 2027,
          link: "https://icdcs2027.icdcs.org/",
          when: "July 5-8, 2027",
          where: "Melbourne, Australia",
          tz: "AoE",
          deadlines: [],
          last: { paper: "2026-01-21 23:59", tz: "AoE", year: 2026 }
        },
        {
          name: "ICPP",
          year: 2026,
          link: "https://icpp2026.github.io/",
          when: "September 29-October 1, 2026",
          where: "Singapore",
          tz: "AoE",
          deadlines: [
            { paper: "2026-05-01 23:59", abstract: "2026-04-24 23:59" }
          ]
        },
        {
          name: "Euro-Par",
          year: 2027,
          link: "https://2027.euro-par.org/",
          when: "August 23-27, 2027",
          where: "",
          tz: "AoE",
          deadlines: [],
          last: { paper: "2026-03-13 23:59", tz: "AoE", year: 2026 }
        },
        {
          name: "Middleware",
          year: 2027,
          link: "https://middleware-conf.github.io/2027/call-for-papers/",
          when: "December 13-17, 2027",
          where: "Kyoto, Japan",
          // The CFP gives dates only; times are the HotCRP submission sites' closing times.
          tz: "UTC",
          deadlines: [
            { paper: "2026-12-04 12:00", abstract: "2026-11-27 12:00", label: "Winter round" },
            { paper: "2027-06-04 12:00", abstract: "2027-05-28 12:00", label: "Summer round" }
          ],
          last: { paper: "2026-06-05 23:59", tz: "AoE", year: 2026 }
        },
        {
          name: "CLUSTER",
          year: 2026,
          link: "https://clustercomp.org/2026",
          when: "September 23-25, 2026",
          where: "Alexandria, Virginia, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-05-07 23:59" }
          ]
        },
        {
          name: "HiPC",
          year: 2027,
          link: "https://hipc.org/",
          when: "December 2027",
          where: "India",
          tz: "AoE",
          deadlines: []
        }
      ]
    },
    {
      id: "edge",
      name: "Edge & Mobile Computing",
      short: "Edge",
      confs: [
        {
          name: "MobiSys",
          year: 2027,
          link: "https://www.sigmobile.org/mobisys/2027/",
          when: "June 21-25, 2027",
          where: "Ho Chi Minh City, Vietnam",
          tz: "AoE",
          deadlines: [
            { paper: "2026-12-04 23:59", abstract: "2026-11-27 23:59" }
          ]
        },
        {
          name: "SenSys",
          year: 2027,
          link: "https://sensys.acm.org/2027/",
          when: "May 17-20, 2027",
          where: "Boulder, CO, USA",
          tz: "AoE",
          deadlines: [
            { paper: "2026-06-05 23:59", abstract: "2026-05-29 23:59", label: "1st deadline" },
            { paper: "2026-11-05 23:59", abstract: "2026-10-29 23:59", label: "2nd deadline" }
          ]
        },
        {
          name: "SEC",
          year: 2027,
          link: "https://acm-ieee-sec.org/",
          when: "December 7-10, 2027 (tentative)",
          where: "Duke University, Durham, NC, USA",
          tz: "AoE",
          deadlines: [],
          last: { paper: "2026-05-08 23:59", tz: "AoE", year: 2026 }
        }
      ]
    }
  ]
};
