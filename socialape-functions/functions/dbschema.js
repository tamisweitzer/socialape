import { user } from "firebase-functions/lib/providers/auth";

let db = {
  screams: [
    {
      userHandle: "user",
      body: "this is the scream body",
      createdAt: "2020-03-27T03:52:09.348Z",
      likeCount: 5,
      commentCount: 2
    }
  ]
};
