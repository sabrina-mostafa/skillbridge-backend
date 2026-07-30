var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/object-assign@4.1.1/node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "node_modules/.pnpm/object-assign@4.1.1/node_modules/object-assign/index.js"(exports, module) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
  }
});

// node_modules/.pnpm/vary@1.1.2/node_modules/vary/index.js
var require_vary = __commonJS({
  "node_modules/.pnpm/vary@1.1.2/node_modules/vary/index.js"(exports, module) {
    "use strict";
    module.exports = vary;
    module.exports.append = append;
    var FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
    function append(header, field) {
      if (typeof header !== "string") {
        throw new TypeError("header argument is required");
      }
      if (!field) {
        throw new TypeError("field argument is required");
      }
      var fields = !Array.isArray(field) ? parse(String(field)) : field;
      for (var j = 0; j < fields.length; j++) {
        if (!FIELD_NAME_REGEXP.test(fields[j])) {
          throw new TypeError("field argument contains an invalid header name");
        }
      }
      if (header === "*") {
        return header;
      }
      var val = header;
      var vals = parse(header.toLowerCase());
      if (fields.indexOf("*") !== -1 || vals.indexOf("*") !== -1) {
        return "*";
      }
      for (var i = 0; i < fields.length; i++) {
        var fld = fields[i].toLowerCase();
        if (vals.indexOf(fld) === -1) {
          vals.push(fld);
          val = val ? val + ", " + fields[i] : fields[i];
        }
      }
      return val;
    }
    function parse(header) {
      var end = 0;
      var list = [];
      var start = 0;
      for (var i = 0, len = header.length; i < len; i++) {
        switch (header.charCodeAt(i)) {
          case 32:
            if (start === end) {
              start = end = i + 1;
            }
            break;
          case 44:
            list.push(header.substring(start, end));
            start = end = i + 1;
            break;
          default:
            end = i + 1;
            break;
        }
      }
      list.push(header.substring(start, end));
      return list;
    }
    function vary(res, field) {
      if (!res || !res.getHeader || !res.setHeader) {
        throw new TypeError("res argument is required");
      }
      var val = res.getHeader("Vary") || "";
      var header = Array.isArray(val) ? val.join(", ") : String(val);
      if (val = append(header, field)) {
        res.setHeader("Vary", val);
      }
    }
  }
});

// node_modules/.pnpm/cors@2.8.6/node_modules/cors/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/cors@2.8.6/node_modules/cors/lib/index.js"(exports, module) {
    "use strict";
    (function() {
      "use strict";
      var assign = require_object_assign();
      var vary = require_vary();
      var defaults = {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
      };
      function isString(s) {
        return typeof s === "string" || s instanceof String;
      }
      function isOriginAllowed(origin, allowedOrigin) {
        if (Array.isArray(allowedOrigin)) {
          for (var i = 0; i < allowedOrigin.length; ++i) {
            if (isOriginAllowed(origin, allowedOrigin[i])) {
              return true;
            }
          }
          return false;
        } else if (isString(allowedOrigin)) {
          return origin === allowedOrigin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        } else {
          return !!allowedOrigin;
        }
      }
      function configureOrigin(options, req) {
        var requestOrigin = req.headers.origin, headers = [], isAllowed;
        if (!options.origin || options.origin === "*") {
          headers.push([{
            key: "Access-Control-Allow-Origin",
            value: "*"
          }]);
        } else if (isString(options.origin)) {
          headers.push([{
            key: "Access-Control-Allow-Origin",
            value: options.origin
          }]);
          headers.push([{
            key: "Vary",
            value: "Origin"
          }]);
        } else {
          isAllowed = isOriginAllowed(requestOrigin, options.origin);
          headers.push([{
            key: "Access-Control-Allow-Origin",
            value: isAllowed ? requestOrigin : false
          }]);
          headers.push([{
            key: "Vary",
            value: "Origin"
          }]);
        }
        return headers;
      }
      function configureMethods(options) {
        var methods = options.methods;
        if (methods.join) {
          methods = options.methods.join(",");
        }
        return {
          key: "Access-Control-Allow-Methods",
          value: methods
        };
      }
      function configureCredentials(options) {
        if (options.credentials === true) {
          return {
            key: "Access-Control-Allow-Credentials",
            value: "true"
          };
        }
        return null;
      }
      function configureAllowedHeaders(options, req) {
        var allowedHeaders = options.allowedHeaders || options.headers;
        var headers = [];
        if (!allowedHeaders) {
          allowedHeaders = req.headers["access-control-request-headers"];
          headers.push([{
            key: "Vary",
            value: "Access-Control-Request-Headers"
          }]);
        } else if (allowedHeaders.join) {
          allowedHeaders = allowedHeaders.join(",");
        }
        if (allowedHeaders && allowedHeaders.length) {
          headers.push([{
            key: "Access-Control-Allow-Headers",
            value: allowedHeaders
          }]);
        }
        return headers;
      }
      function configureExposedHeaders(options) {
        var headers = options.exposedHeaders;
        if (!headers) {
          return null;
        } else if (headers.join) {
          headers = headers.join(",");
        }
        if (headers && headers.length) {
          return {
            key: "Access-Control-Expose-Headers",
            value: headers
          };
        }
        return null;
      }
      function configureMaxAge(options) {
        var maxAge = (typeof options.maxAge === "number" || options.maxAge) && options.maxAge.toString();
        if (maxAge && maxAge.length) {
          return {
            key: "Access-Control-Max-Age",
            value: maxAge
          };
        }
        return null;
      }
      function applyHeaders(headers, res) {
        for (var i = 0, n = headers.length; i < n; i++) {
          var header = headers[i];
          if (header) {
            if (Array.isArray(header)) {
              applyHeaders(header, res);
            } else if (header.key === "Vary" && header.value) {
              vary(res, header.value);
            } else if (header.value) {
              res.setHeader(header.key, header.value);
            }
          }
        }
      }
      function cors2(options, req, res, next) {
        var headers = [], method = req.method && req.method.toUpperCase && req.method.toUpperCase();
        if (method === "OPTIONS") {
          headers.push(configureOrigin(options, req));
          headers.push(configureCredentials(options));
          headers.push(configureMethods(options));
          headers.push(configureAllowedHeaders(options, req));
          headers.push(configureMaxAge(options));
          headers.push(configureExposedHeaders(options));
          applyHeaders(headers, res);
          if (options.preflightContinue) {
            next();
          } else {
            res.statusCode = options.optionsSuccessStatus;
            res.setHeader("Content-Length", "0");
            res.end();
          }
        } else {
          headers.push(configureOrigin(options, req));
          headers.push(configureCredentials(options));
          headers.push(configureExposedHeaders(options));
          applyHeaders(headers, res);
          next();
        }
      }
      function middlewareWrapper(o) {
        var optionsCallback = null;
        if (typeof o === "function") {
          optionsCallback = o;
        } else {
          optionsCallback = function(req, cb) {
            cb(null, o);
          };
        }
        return function corsMiddleware(req, res, next) {
          optionsCallback(req, function(err, options) {
            if (err) {
              next(err);
            } else {
              var corsOptions = assign({}, defaults, options);
              var originCallback = null;
              if (corsOptions.origin && typeof corsOptions.origin === "function") {
                originCallback = corsOptions.origin;
              } else if (corsOptions.origin) {
                originCallback = function(origin, cb) {
                  cb(null, corsOptions.origin);
                };
              }
              if (originCallback) {
                originCallback(req.headers.origin, function(err2, origin) {
                  if (err2 || !origin) {
                    next(err2);
                  } else {
                    corsOptions.origin = origin;
                    cors2(corsOptions, req, res, next);
                  }
                });
              } else {
                next();
              }
            }
          });
        };
      }
      module.exports = middlewareWrapper;
    })();
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import express4 from "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": `model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  role             Role?
  status           Status  @default(ACTIVE)
  profileCompleted Boolean @default(false)

  tutorProfile   TutorProfile?
  studentProfile StudentProfile?

  conversationParticipants ConversationParticipant[]
  sentMessages             Message[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}

enum Role {
  ADMIN
  TUTOR
  STUDENT
}

enum Status {
  ACTIVE
  BLOCKED
}

model Availability {
  id String @id @default(uuid())

  tutorId String
  tutor   TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)

  dayOfWeek DayOfWeek

  // store ONLY time reference (UTC base date)
  startTime String
  endTime   String

  slotDuration Int     @default(30) // minutes (future-proof)
  isActive     Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tutorId, dayOfWeek])
}

enum DayOfWeek {
  SUNDAY
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
}

model Booking {
  id String @id @default(uuid())

  tutorId String
  tutor   TutorProfile @relation("tutorBookings", fields: [tutorId], references: [id])

  studentId String
  student   StudentProfile @relation("studentBookings", fields: [studentId], references: [id])

  categoryId String
  category   Categories @relation(fields: [categoryId], references: [id])

  date      DateTime
  // derived range (for quick queries)
  startTime DateTime
  endTime   DateTime

  status        BookingStatus @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)

  meetingLink String?
  meetingType String? // GOOGLE_MEET

  review Review? @relation("BookingReview")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tutorId])
  @@index([studentId])
  @@index([tutorId, date])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  DECLINED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
}

model Categories {
  id   String @id @default(uuid())
  name String @unique

  // slug        String   @unique
  shortDesc   String?
  description String? @db.Text

  thumbnail        String?
  learningOutcomes String[]

  isFeatured Boolean @default(true)

  parentId String?
  parent   Categories?  @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children Categories[] @relation("CategoryHierarchy")

  tutors   TutorCategory[]
  students StudentCategory[]
  bookings Booking[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContactMessage {
  id String @id @default(uuid())

  fullName String
  email    String
  phone    String?

  userType String

  inquiryType String[]

  message String

  createdAt DateTime @default(now())
}

model ConversationParticipant {
  id String @id @default(uuid())

  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  joinedAt DateTime @default(now())

  @@unique([conversationId, userId])
}

model Conversation {
  id String @id @default(uuid())

  lastMessageAt DateTime?

  messages     Message[]
  participants ConversationParticipant[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// For google meet link

model GoogleAccount {
  id String @id @default(uuid())

  userId String @unique

  accessToken  String
  refreshToken String
  expiryDate   DateTime?

  createdAt DateTime @default(now())
}

model Message {
  id String @id @default(uuid())

  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  senderId String
  sender   User   @relation(fields: [senderId], references: [id], onDelete: Cascade)

  content String  @db.Text
  isRead  Boolean @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Review {
  id String @id @default(uuid())

  tutorId String
  tutor   TutorProfile @relation("tutorReviews", fields: [tutorId], references: [id])

  studentId String
  student   StudentProfile @relation("studentReviews", fields: [studentId], references: [id])

  bookingId String  @unique
  booking   Booking @relation("BookingReview", fields: [bookingId], references: [id], onDelete: Cascade)

  rating  Int
  comment String? @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tutorId])
}

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: \`npx create-db\`

generator client {
  provider = "prisma-client"
  output   = "../../generated/prisma" // This path is relative to the location of schema.prisma's folder
  /**
   * ../ \u2192 go one folder up from schema.prisma's folder
   * ../../ \u2192 go two folder up from schema.prisma's folder
   * then \u2192 generated/prisma
   */
}

datasource db {
  provider = "postgresql"
}

model StudentCategory {
  studentId  String
  categoryId String

  student  StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  category Categories     @relation(fields: [categoryId], references: [id])

  @@id([studentId, categoryId])
}

model StudentProfile {
  id        String  @id @default(uuid())
  bio       String? @db.Text
  education String? @db.VarChar(225)

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  bookingsAsStudent Booking[] @relation("studentBookings")
  studentReviews    Review[]  @relation("studentReviews")

  categories StudentCategory[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TutorCategory {
  tutorId    String
  categoryId String

  tutor    TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)
  category Categories   @relation(fields: [categoryId], references: [id])

  @@id([tutorId, categoryId])
}

model TutorProfile {
  id           String  @id @default(uuid())
  bio          String? @db.Text
  education    String? @db.VarChar(225)
  experience   String  @db.VarChar(225)
  hourlyRate   Decimal @db.Decimal(10, 2)
  isFeatured   Boolean @default(false)
  avgRating    Float   @default(0)
  totalReviews Int     @default(0)

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  bookingsAsTutor Booking[] @relation("tutorBookings")
  tutorReviews    Review[]  @relation("tutorReviews")

  availability Availability[]
  categories   TutorCategory[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"profileCompleted","kind":"scalar","type":"Boolean"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"conversationParticipants","kind":"object","type":"ConversationParticipant","relationName":"ConversationParticipantToUser"},{"name":"sentMessages","kind":"object","type":"Message","relationName":"MessageToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"dayOfWeek","kind":"enum","type":"DayOfWeek"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"slotDuration","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"tutorBookings"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"StudentProfile","relationName":"studentBookings"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Categories","relationName":"BookingToCategories"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"meetingLink","kind":"scalar","type":"String"},{"name":"meetingType","kind":"scalar","type":"String"},{"name":"review","kind":"object","type":"Review","relationName":"BookingReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Categories":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"shortDesc","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnail","kind":"scalar","type":"String"},{"name":"learningOutcomes","kind":"scalar","type":"String"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Categories","relationName":"CategoryHierarchy"},{"name":"children","kind":"object","type":"Categories","relationName":"CategoryHierarchy"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoriesToTutorCategory"},{"name":"students","kind":"object","type":"StudentCategory","relationName":"CategoriesToStudentCategory"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToCategories"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ContactMessage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"userType","kind":"scalar","type":"String"},{"name":"inquiryType","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ConversationParticipant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"conversation","kind":"object","type":"Conversation","relationName":"ConversationToConversationParticipant"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ConversationParticipantToUser"},{"name":"joinedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Conversation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"lastMessageAt","kind":"scalar","type":"DateTime"},{"name":"messages","kind":"object","type":"Message","relationName":"ConversationToMessage"},{"name":"participants","kind":"object","type":"ConversationParticipant","relationName":"ConversationToConversationParticipant"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"GoogleAccount":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"conversationId","kind":"scalar","type":"String"},{"name":"conversation","kind":"object","type":"Conversation","relationName":"ConversationToMessage"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"sender","kind":"object","type":"User","relationName":"MessageToUser"},{"name":"content","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"tutorReviews"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"StudentProfile","relationName":"studentReviews"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"StudentCategory":{"fields":[{"name":"studentId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"StudentProfile","relationName":"StudentCategoryToStudentProfile"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToStudentCategory"}],"dbName":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"education","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"},{"name":"bookingsAsStudent","kind":"object","type":"Booking","relationName":"studentBookings"},{"name":"studentReviews","kind":"object","type":"Review","relationName":"studentReviews"},{"name":"categories","kind":"object","type":"StudentCategory","relationName":"StudentCategoryToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutorId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToTutorCategory"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"education","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Decimal"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"avgRating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"bookingsAsTutor","kind":"object","type":"Booking","relationName":"tutorBookings"},{"name":"tutorReviews","kind":"object","type":"Review","relationName":"tutorReviews"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","tutor","bookingsAsStudent","student","booking","studentReviews","parent","children","category","tutors","students","bookings","_count","categories","review","bookingsAsTutor","tutorReviews","availability","tutorProfile","studentProfile","conversation","sender","messages","participants","conversationParticipants","sentMessages","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","_avg","_sum","Availability.groupBy","Availability.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Categories.findUnique","Categories.findUniqueOrThrow","Categories.findFirst","Categories.findFirstOrThrow","Categories.findMany","Categories.createOne","Categories.createMany","Categories.createManyAndReturn","Categories.updateOne","Categories.updateMany","Categories.updateManyAndReturn","Categories.upsertOne","Categories.deleteOne","Categories.deleteMany","Categories.groupBy","Categories.aggregate","ContactMessage.findUnique","ContactMessage.findUniqueOrThrow","ContactMessage.findFirst","ContactMessage.findFirstOrThrow","ContactMessage.findMany","ContactMessage.createOne","ContactMessage.createMany","ContactMessage.createManyAndReturn","ContactMessage.updateOne","ContactMessage.updateMany","ContactMessage.updateManyAndReturn","ContactMessage.upsertOne","ContactMessage.deleteOne","ContactMessage.deleteMany","ContactMessage.groupBy","ContactMessage.aggregate","ConversationParticipant.findUnique","ConversationParticipant.findUniqueOrThrow","ConversationParticipant.findFirst","ConversationParticipant.findFirstOrThrow","ConversationParticipant.findMany","ConversationParticipant.createOne","ConversationParticipant.createMany","ConversationParticipant.createManyAndReturn","ConversationParticipant.updateOne","ConversationParticipant.updateMany","ConversationParticipant.updateManyAndReturn","ConversationParticipant.upsertOne","ConversationParticipant.deleteOne","ConversationParticipant.deleteMany","ConversationParticipant.groupBy","ConversationParticipant.aggregate","Conversation.findUnique","Conversation.findUniqueOrThrow","Conversation.findFirst","Conversation.findFirstOrThrow","Conversation.findMany","Conversation.createOne","Conversation.createMany","Conversation.createManyAndReturn","Conversation.updateOne","Conversation.updateMany","Conversation.updateManyAndReturn","Conversation.upsertOne","Conversation.deleteOne","Conversation.deleteMany","Conversation.groupBy","Conversation.aggregate","GoogleAccount.findUnique","GoogleAccount.findUniqueOrThrow","GoogleAccount.findFirst","GoogleAccount.findFirstOrThrow","GoogleAccount.findMany","GoogleAccount.createOne","GoogleAccount.createMany","GoogleAccount.createManyAndReturn","GoogleAccount.updateOne","GoogleAccount.updateMany","GoogleAccount.updateManyAndReturn","GoogleAccount.upsertOne","GoogleAccount.deleteOne","GoogleAccount.deleteMany","GoogleAccount.groupBy","GoogleAccount.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","StudentCategory.findUnique","StudentCategory.findUniqueOrThrow","StudentCategory.findFirst","StudentCategory.findFirstOrThrow","StudentCategory.findMany","StudentCategory.createOne","StudentCategory.createMany","StudentCategory.createManyAndReturn","StudentCategory.updateOne","StudentCategory.updateMany","StudentCategory.updateManyAndReturn","StudentCategory.upsertOne","StudentCategory.deleteOne","StudentCategory.deleteMany","StudentCategory.groupBy","StudentCategory.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","TutorCategory.findUnique","TutorCategory.findUniqueOrThrow","TutorCategory.findFirst","TutorCategory.findFirstOrThrow","TutorCategory.findMany","TutorCategory.createOne","TutorCategory.createMany","TutorCategory.createManyAndReturn","TutorCategory.updateOne","TutorCategory.updateMany","TutorCategory.updateManyAndReturn","TutorCategory.upsertOne","TutorCategory.deleteOne","TutorCategory.deleteMany","TutorCategory.groupBy","TutorCategory.aggregate","TutorProfile.findUnique","TutorProfile.findUniqueOrThrow","TutorProfile.findFirst","TutorProfile.findFirstOrThrow","TutorProfile.findMany","TutorProfile.createOne","TutorProfile.createMany","TutorProfile.createManyAndReturn","TutorProfile.updateOne","TutorProfile.updateMany","TutorProfile.updateManyAndReturn","TutorProfile.upsertOne","TutorProfile.deleteOne","TutorProfile.deleteMany","TutorProfile.groupBy","TutorProfile.aggregate","AND","OR","NOT","id","bio","education","experience","hourlyRate","isFeatured","avgRating","totalReviews","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","tutorId","categoryId","studentId","bookingId","rating","comment","conversationId","senderId","content","isRead","accessToken","refreshToken","expiryDate","lastMessageAt","joinedAt","fullName","email","phone","userType","inquiryType","message","has","hasEvery","hasSome","name","shortDesc","description","thumbnail","learningOutcomes","parentId","date","startTime","endTime","BookingStatus","status","PaymentStatus","paymentStatus","meetingLink","meetingType","DayOfWeek","dayOfWeek","slotDuration","isActive","identifier","value","expiresAt","accountId","providerId","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","image","Role","role","Status","profileCompleted","conversationId_userId","tutorId_categoryId","studentId_categoryId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "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-wIAAK4E-wIi_AICAO8DACH9AiAA7QMAIQEGAACsBwAgDQYAAK8EACC3AgAArQQAMLgCAAAuABC5AgAArQQAMLoCAQAAAAHDAkAA8AMAIcQCQADwAwAh0wIBAOsDACHyAgEA6wMAIfMCAQDrAwAh-wIAAK4E-wIi_AICAO8DACH9AiAA7QMAIQMAAAAuACABAAAvADACAAAwACADAAAAHwAgAQAAIAAwAgAAIQAgAQAAAA0AIAEAAAASACABAAAALgAgAQAAAB8AIA0DAADxAwAgBwAA8gMAIAoAAPMDACASAAD5AwAgtwIAAPgDADC4AgAANwAQuQIAAPgDADC6AgEA6wMAIbsCAQDqAwAhvAIBAOoDACHCAgEA6wMAIcMCQADwAwAhxAJAAPADACEBAAAANwAgCQMAAPEDACAZAACqBAAgtwIAAKwEADC4AgAAOQAQuQIAAKwEADC6AgEA6wMAIcICAQDrAwAh2QIBAOsDACHhAkAA8AMAIQIDAACeBQAgGQAArgcAIAoDAADxAwAgGQAAqgQAILcCAACsBAAwuAIAADkAELkCAACsBAAwugIBAAAAAcICAQDrAwAh2QIBAOsDACHhAkAA8AMAIZEDAACrBAAgAwAAADkAIAEAADoAMAIAADsAIAwZAACqBAAgGgAA8QMAILcCAACpBAAwuAIAAD0AELkCAACpBAAwugIBAOsDACHDAkAA8AMAIcQCQADwAwAh2QIBAOsDACHaAgEA6wMAIdsCAQDrAwAh3AIgAO0DACECGQAArgcAIBoAAJ4FACAMGQAAqgQAIBoAAPEDACC3AgAAqQQAMLgCAAA9ABC5AgAAqQQAMLoCAQAAAAHDAkAA8AMAIcQCQADwAwAh2QIBAOsDACHaAgEA6wMAIdsCAQDrAwAh3AIgAO0DACEDAAAAPQAgAQAAPgAwAgAAPwAgAwAAADkAIAEAADoAMAIAADsAIAEAAAA9ACABAAAAOQAgAwAAAD0AIAEAAD4AMAIAAD8AIAEAAAADACABAAAABwAgAQAAADkAIAEAAAA9ACABAAAAAQAgEwQAAKUEACAFAACmBAAgFwAApwQAIBgAAKgEACAdAACGBAAgHgAAhQQAILcCAACiBAAwuAIAAEoAELkCAACiBAAwugIBAOsDACHDAkAA8AMAIcQCQADwAwAh4wIBAOsDACHrAgEA6wMAIfUCAACkBJADIosDIADtAwAhjAMBAOoDACGOAwAAowSOAyOQAyAA7QMAIQgEAACqBwAgBQAAqwcAIBcAAKwHACAYAACtBwAgHQAAjQYAIB4AAIwGACCMAwAAwQQAII4DAADBBAAgAwAAAEoAIAEAAEsAMAIAAAEAIAMAAABKACABAABLADACAAABACADAAAASgAgAQAASwAwAgAAAQAgEAQAAKQHACAFAAClBwAgFwAApgcAIBgAAKcHACAdAACoBwAgHgAAqQcAILoCAQAAAAHDAkAAAAABxAJAAAAAAeMCAQAAAAHrAgEAAAAB9QIAAACQAwKLAyAAAAABjAMBAAAAAY4DAAAAjgMDkAMgAAAAAQEkAABPACAKugIBAAAAAcMCQAAAAAHEAkAAAAAB4wIBAAAAAesCAQAAAAH1AgAAAJADAosDIAAAAAGMAwEAAAABjgMAAACOAwOQAyAAAAABASQAAFEAMAEkAABRADAQBAAA6gYAIAUAAOsGACAXAADsBgAgGAAA7QYAIB0AAO4GACAeAADvBgAgugIBAMcEACHDAkAAzQQAIcQCQADNBAAh4wIBAMcEACHrAgEAxwQAIfUCAADpBpADIosDIADKBAAhjAMBAMgEACGOAwAA6AaOAyOQAyAAygQAIQIAAAABACAkAABUACAKugIBAMcEACHDAkAAzQQAIcQCQADNBAAh4wIBAMcEACHrAgEAxwQAIfUCAADpBpADIosDIADKBAAhjAMBAMgEACGOAwAA6AaOAyOQAyAAygQAIQIAAABKACAkAABWACACAAAASgAgJAAAVgAgAwAAAAEAICsAAE8AICwAAFQAIAEAAAABACABAAAASgAgBREAAOUGACAxAADnBgAgMgAA5gYAIIwDAADBBAAgjgMAAMEEACANtwIAAJsEADC4AgAAXQAQuQIAAJsEADC6AgEA0wMAIcMCQADZAwAhxAJAANkDACHjAgEA0wMAIesCAQDTAwAh9QIAAJ0EkAMiiwMgANYDACGMAwEA1AMAIY4DAACcBI4DI5ADIADWAwAhAwAAAEoAIAEAAFwAMDAAAF0AIAMAAABKACABAABLADACAAABACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAkDAADkBgAgugIBAAAAAcICAQAAAAHDAkAAAAABxAJAAAAAAYADQAAAAAGIAwEAAAABiQMBAAAAAYoDAQAAAAEBJAAAZQAgCLoCAQAAAAHCAgEAAAABwwJAAAAAAcQCQAAAAAGAA0AAAAABiAMBAAAAAYkDAQAAAAGKAwEAAAABASQAAGcAMAEkAABnADAJAwAA4wYAILoCAQDHBAAhwgIBAMcEACHDAkAAzQQAIcQCQADNBAAhgANAAM0EACGIAwEAxwQAIYkDAQDIBAAhigMBAMgEACECAAAABQAgJAAAagAgCLoCAQDHBAAhwgIBAMcEACHDAkAAzQQAIcQCQADNBAAhgANAAM0EACGIAwEAxwQAIYkDAQDIBAAhigMBAMgEACECAAAAAwAgJAAAbAAgAgAAAAMAICQAAGwAIAMAAAAFACArAABlACAsAABqACABAAAABQAgAQAAAAMAIAURAADgBgAgMQAA4gYAIDIAAOEGACCJAwAAwQQAIIoDAADBBAAgC7cCAACaBAAwuAIAAHMAELkCAACaBAAwugIBANMDACHCAgEA0wMAIcMCQADZAwAhxAJAANkDACGAA0AA2QMAIYgDAQDTAwAhiQMBANQDACGKAwEA1AMAIQMAAAADACABAAByADAwAABzACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAA3wYAILoCAQAAAAHCAgEAAAABwwJAAAAAAcQCQAAAAAHdAgEAAAAB3gIBAAAAAYEDAQAAAAGCAwEAAAABgwMBAAAAAYQDQAAAAAGFA0AAAAABhgMBAAAAAYcDAQAAAAEBJAAAewAgDboCAQAAAAHCAgEAAAABwwJAAAAAAcQCQAAAAAHdAgEAAAAB3gIBAAAAAYEDAQAAAAGCAwEAAAABgwMBAAAAAYQDQAAAAAGFA0AAAAABhgMBAAAAAYcDAQAAAAEBJAAAfQAwASQAAH0AMA4DAADeBgAgugIBAMcEACHCAgEAxwQAIcMCQADNBAAhxAJAAM0EACHdAgEAyAQAId4CAQDIBAAhgQMBAMcEACGCAwEAxwQAIYMDAQDIBAAhhANAAOoFACGFA0AA6gUAIYYDAQDIBAAhhwMBAMgEACECAAAACQAgJAAAgAEAIA26AgEAxwQAIcICAQDHBAAhwwJAAM0EACHEAkAAzQQAId0CAQDIBAAh3gIBAMgEACGBAwEAxwQAIYIDAQDHBAAhgwMBAMgEACGEA0AA6gUAIYUDQADqBQAhhgMBAMgEACGHAwEAyAQAIQIAAAAHACAkAACCAQAgAgAAAAcAICQAAIIBACADAAAACQAgKwAAewAgLAAAgAEAIAEAAAAJACABAAAABwAgChEAANsGACAxAADdBgAgMgAA3AYAIN0CAADBBAAg3gIAAMEEACCDAwAAwQQAIIQDAADBBAAghQMAAMEEACCGAwAAwQQAIIcDAADBBAAgELcCAACZBAAwuAIAAIkBABC5AgAAmQQAMLoCAQDTAwAhwgIBANMDACHDAkAA2QMAIcQCQADZAwAh3QIBANQDACHeAgEA1AMAIYEDAQDTAwAhggMBANMDACGDAwEA1AMAIYQDQAD-AwAhhQNAAP4DACGGAwEA1AMAIYcDAQDUAwAhAwAAAAcAIAEAAIgBADAwAACJAQAgAwAAAAcAIAEAAAgAMAIAAAkAIAm3AgAAmAQAMLgCAACPAQAQuQIAAJgEADC6AgEAAAABwwJAAPADACHEAkAA8AMAIf4CAQDrAwAh_wIBAOsDACGAA0AA8AMAIQEAAACMAQAgAQAAAIwBACAJtwIAAJgEADC4AgAAjwEAELkCAACYBAAwugIBAOsDACHDAkAA8AMAIcQCQADwAwAh_gIBAOsDACH_AgEA6wMAIYADQADwAwAhAAMAAACPAQAgAQAAkAEAMAIAAIwBACADAAAAjwEAIAEAAJABADACAACMAQAgAwAAAI8BACABAACQAQAwAgAAjAEAIAa6AgEAAAABwwJAAAAAAcQCQAAAAAH-AgEAAAAB_wIBAAAAAYADQAAAAAEBJAAAlAEAIAa6AgEAAAABwwJAAAAAAcQCQAAAAAH-AgEAAAAB_wIBAAAAAYADQAAAAAEBJAAAlgEAMAEkAACWAQAwBroCAQDHBAAhwwJAAM0EACHEAkAAzQQAIf4CAQDHBAAh_wIBAMcEACGAA0AAzQQAIQIAAACMAQAgJAAAmQEAIAa6AgEAxwQAIcMCQADNBAAhxAJAAM0EACH-AgEAxwQAIf8CAQDHBAAhgANAAM0EACECAAAAjwEAICQAAJsBACACAAAAjwEAICQAAJsBACADAAAAjAEAICsAAJQBACAsAACZAQAgAQAAAIwBACABAAAAjwEAIAMRAADYBgAgMQAA2gYAIDIAANkGACAJtwIAAJcEADC4AgAAogEAELkCAACXBAAwugIBANMDACHDAkAA2QMAIcQCQADZAwAh_gIBANMDACH_AgEA0wMAIYADQADZAwAhAwAAAI8BACABAAChAQAwMAAAogEAIAMAAACPAQAgAQAAkAEAMAIAAIwBACABAAAAMAAgAQAAADAAIAMAAAAuACABAAAvADACAAAwACADAAAALgAgAQAALwAwAgAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAoGAADXBgAgugIBAAAAAcMCQAAAAAHEAkAAAAAB0wIBAAAAAfICAQAAAAHzAgEAAAAB-wIAAAD7AgL8AgIAAAAB_QIgAAAAAQEkAACqAQAgCboCAQAAAAHDAkAAAAABxAJAAAAAAdMCAQAAAAHyAgEAAAAB8wIBAAAAAfsCAAAA-wIC_AICAAAAAf0CIAAAAAEBJAAArAEAMAEkAACsAQAwCgYAANYGACC6AgEAxwQAIcMCQADNBAAhxAJAAM0EACHTAgEAxwQAIfICAQDHBAAh8wIBAMcEACH7AgAA6wT7AiL8AgIAzAQAIf0CIADKBAAhAgAAADAAICQAAK8BACAJugIBAMcEACHDAkAAzQQAIcQCQADNBAAh0wIBAMcEACHyAgEAxwQAIfMCAQDHBAAh-wIAAOsE-wIi_AICAMwEACH9AiAAygQAIQIAAAAuACAkAACxAQAgAgAAAC4AICQAALEBACADAAAAMAAgKwAAqgEAICwAAK8BACABAAAAMAAgAQAAAC4AIAURAADRBgAgMQAA1AYAIDIAANMGACBzAADSBgAgdAAA1QYAIAy3AgAAkwQAMLgCAAC4AQAQuQIAAJMEADC6AgEA0wMAIcMCQADZAwAhxAJAANkDACHTAgEA0wMAIfICAQDTAwAh8wIBANMDACH7AgAAlAT7AiL8AgIA2AMAIf0CIADWAwAhAwAAAC4AIAEAALcBADAwAAC4AQAgAwAAAC4AIAEAAC8AMAIAADAAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgEQYAANAFACAIAACWBQAgDQAAlwUAIBMAAJgFACC6AgEAAAABwwJAAAAAAcQCQAAAAAHTAgEAAAAB1AIBAAAAAdUCAQAAAAHxAkAAAAAB8gJAAAAAAfMCQAAAAAH1AgAAAPUCAvcCAAAA9wIC-AIBAAAAAfkCAQAAAAEBJAAAwAEAIA26AgEAAAABwwJAAAAAAcQCQAAAAAHTAgEAAAAB1AIBAAAAAdUCAQAAAAHxAkAAAAAB8gJAAAAAAfMCQAAAAAH1AgAAAPUCAvcCAAAA9wIC-AIBAAAAAfkCAQAAAAEBJAAAwgEAMAEkAADCAQAwEQYAAM4FACAIAACLBQAgDQAAjAUAIBMAAI0FACC6AgEAxwQAIcMCQADNBAAhxAJAAM0EACHTAgEAxwQAIdQCAQDHBAAh1QIBAMcEACHxAkAAzQQAIfICQADNBAAh8wJAAM0EACH1AgAAiAX1AiL3AgAAiQX3AiL4AgEAyAQAIfkCAQDIBAAhAgAAAA8AICQAAMUBACANugIBAMcEACHDAkAAzQQAIcQCQADNBAAh0wIBAMcEACHUAgEAxwQAIdUCAQDHBAAh8QJAAM0EACHyAkAAzQQAIfMCQADNBAAh9QIAAIgF9QIi9wIAAIkF9wIi-AIBAMgEACH5AgEAyAQAIQIAAAANACAkAADHAQAgAgAAAA0AICQAAMcBACADAAAADwAgKwAAwAEAICwAAMUBACABAAAADwAgAQAAAA0AIAURAADOBgAgMQAA0AYAIDIAAM8GACD4AgAAwQQAIPkCAADBBAAgELcCAACMBAAwuAIAAM4BABC5AgAAjAQAMLoCAQDTAwAhwwJAANkDACHEAkAA2QMAIdMCAQDTAwAh1AIBANMDACHVAgEA0wMAIfECQADZAwAh8gJAANkDACHzAkAA2QMAIfUCAACNBPUCIvcCAACOBPcCIvgCAQDUAwAh-QIBANQDACEDAAAADQAgAQAAzQEAMDAAAM4BACADAAAADQAgAQAADgAwAgAADwAgAQAAAB0AIAEAAAAdACADAAAAGgAgAQAAHAAwAgAAHQAgAwAAABoAIAEAABwAMAIAAB0AIAMAAAAaACABAAAcADACAAAdACAPCwAAzQYAIAwAAMkGACAOAADKBgAgDwAAywYAIBAAAMwGACC6AgEAAAABvwIgAAAAAcMCQAAAAAHEAkAAAAAB6wIBAAAAAewCAQAAAAHtAgEAAAAB7gIBAAAAAe8CAADIBgAg8AIBAAAAAQEkAADWAQAgCroCAQAAAAG_AiAAAAABwwJAAAAAAcQCQAAAAAHrAgEAAAAB7AIBAAAAAe0CAQAAAAHuAgEAAAAB7wIAAMgGACDwAgEAAAABASQAANgBADABJAAA2AEAMAEAAAAaACAPCwAAnAYAIAwAAJ0GACAOAACeBgAgDwAAnwYAIBAAAKAGACC6AgEAxwQAIb8CIADKBAAhwwJAAM0EACHEAkAAzQQAIesCAQDHBAAh7AIBAMgEACHtAgEAyAQAIe4CAQDIBAAh7wIAAJsGACDwAgEAyAQAIQIAAAAdACAkAADcAQAgCroCAQDHBAAhvwIgAMoEACHDAkAAzQQAIcQCQADNBAAh6wIBAMcEACHsAgEAyAQAIe0CAQDIBAAh7gIBAMgEACHvAgAAmwYAIPACAQDIBAAhAgAAABoAICQAAN4BACACAAAAGgAgJAAA3gEAIAEAAAAaACADAAAAHQAgKwAA1gEAICwAANwBACABAAAAHQAgAQAAABoAIAcRAACYBgAgMQAAmgYAIDIAAJkGACDsAgAAwQQAIO0CAADBBAAg7gIAAMEEACDwAgAAwQQAIA23AgAAiwQAMLgCAADmAQAQuQIAAIsEADC6AgEA0wMAIb8CIADWAwAhwwJAANkDACHEAkAA2QMAIesCAQDTAwAh7AIBANQDACHtAgEA1AMAIe4CAQDUAwAh7wIAAIkEACDwAgEA1AMAIQMAAAAaACABAADlAQAwMAAA5gEAIAMAAAAaACABAAAcADACAAAdACALtwIAAIoEADC4AgAA7AEAELkCAACKBAAwugIBAAAAAcMCQADwAwAh4gIBAOsDACHjAgEA6wMAIeQCAQDqAwAh5QIBAOsDACHmAgAAiQQAIOcCAQDrAwAhAQAAAOkBACABAAAA6QEAIAu3AgAAigQAMLgCAADsAQAQuQIAAIoEADC6AgEA6wMAIcMCQADwAwAh4gIBAOsDACHjAgEA6wMAIeQCAQDqAwAh5QIBAOsDACHmAgAAiQQAIOcCAQDrAwAhAeQCAADBBAAgAwAAAOwBACABAADtAQAwAgAA6QEAIAMAAADsAQAgAQAA7QEAMAIAAOkBACADAAAA7AEAIAEAAO0BADACAADpAQAgCLoCAQAAAAHDAkAAAAAB4gIBAAAAAeMCAQAAAAHkAgEAAAAB5QIBAAAAAeYCAACXBgAg5wIBAAAAAQEkAADxAQAgCLoCAQAAAAHDAkAAAAAB4gIBAAAAAeMCAQAAAAHkAgEAAAAB5QIBAAAAAeYCAACXBgAg5wIBAAAAAQEkAADzAQAwASQAAPMBADAIugIBAMcEACHDAkAAzQQAIeICAQDHBAAh4wIBAMcEACHkAgEAyAQAIeUCAQDHBAAh5gIAAJYGACDnAgEAxwQAIQIAAADpAQAgJAAA9gEAIAi6AgEAxwQAIcMCQADNBAAh4gIBAMcEACHjAgEAxwQAIeQCAQDIBAAh5QIBAMcEACHmAgAAlgYAIOcCAQDHBAAhAgAAAOwBACAkAAD4AQAgAgAAAOwBACAkAAD4AQAgAwAAAOkBACArAADxAQAgLAAA9gEAIAEAAADpAQAgAQAAAOwBACAEEQAAkwYAIDEAAJUGACAyAACUBgAg5AIAAMEEACALtwIAAIgEADC4AgAA_wEAELkCAACIBAAwugIBANMDACHDAkAA2QMAIeICAQDTAwAh4wIBANMDACHkAgEA1AMAIeUCAQDTAwAh5gIAAIkEACDnAgEA0wMAIQMAAADsAQAgAQAA_gEAMDAAAP8BACADAAAA7AEAIAEAAO0BADACAADpAQAgAQAAADsAIAEAAAA7ACADAAAAOQAgAQAAOgAwAgAAOwAgAwAAADkAIAEAADoAMAIAADsAIAMAAAA5ACABAAA6ADACAAA7ACAGAwAA_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_QMAMLoCAQDTAwAhwgIBANMDACHDAkAA2QMAId0CAQDTAwAh3gIBANMDACHfAkAA_gMAIQMAAAC0AgAgAQAAxgIAMDAAAMcCACADAAAAtAIAIAEAALUCADACAACxAgAgAQAAAD8AIAEAAAA_ACADAAAAPQAgAQAAPgAwAgAAPwAgAwAAAD0AIAEAAD4AMAIAAD8AIAMAAAA9ACABAAA-ADACAAA_ACAJGQAA5QUAIBoAAOYFACC6AgEAAAABwwJAAAAAAcQCQAAAAAHZAgEAAAAB2gIBAAAAAdsCAQAAAAHcAiAAAAABASQAAM8CACAHugIBAAAAAcMCQAAAAAHEAkAAAAAB2QIBAAAAAdoCAQAAAAHbAgEAAAAB3AIgAAAAAQEkAADRAgAwASQAANECADAJGQAA4wUAIBoAAOQFACC6AgEAxwQAIcMCQADNBAAhxAJAAM0EACHZAgEAxwQAIdoCAQDHBAAh2wIBAMcEACHcAiAAygQAIQIAAAA_ACAkAADUAgAgB7oCAQDHBAAhwwJAAM0EACHEAkAAzQQAIdkCAQDHBAAh2gIBAMcEACHbAgEAxwQAIdwCIADKBAAhAgAAAD0AICQAANYCACACAAAAPQAgJAAA1gIAIAMAAAA_ACArAADPAgAgLAAA1AIAIAEAAAA_ACABAAAAPQAgAxEAAOAFACAxAADiBQAgMgAA4QUAIAq3AgAA_AMAMLgCAADdAgAQuQIAAPwDADC6AgEA0wMAIcMCQADZAwAhxAJAANkDACHZAgEA0wMAIdoCAQDTAwAh2wIBANMDACHcAiAA1gMAIQMAAAA9ACABAADcAgAwMAAA3QIAIAMAAAA9ACABAAA-ADACAAA_ACABAAAAFAAgAQAAABQAIAMAAAASACABAAATADACAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgAwAAABIAIAEAABMAMAIAABQAIAsGAACUBQAgCAAA_AQAIAkAAP0EACC6AgEAAAABwwJAAAAAAcQCQAAAAAHTAgEAAAAB1QIBAAAAAdYCAQAAAAHXAgIAAAAB2AIBAAAAAQEkAADlAgAgCLoCAQAAAAHDAkAAAAABxAJAAAAAAdMCAQAAAAHVAgEAAAAB1gIBAAAAAdcCAgAAAAHYAgEAAAABASQAAOcCADABJAAA5wIAMAsGAACTBQAgCAAA-QQAIAkAAPoEACC6AgEAxwQAIcMCQADNBAAhxAJAAM0EACHTAgEAxwQAIdUCAQDHBAAh1gIBAMcEACHXAgIAzAQAIdgCAQDIBAAhAgAAABQAICQAAOoCACAIugIBAMcEACHDAkAAzQQAIcQCQADNBAAh0wIBAMcEACHVAgEAxwQAIdYCAQDHBAAh1wICAMwEACHYAgEAyAQAIQIAAAASACAkAADsAgAgAgAAABIAICQAAOwCACADAAAAFAAgKwAA5QIAICwAAOoCACABAAAAFAAgAQAAABIAIAYRAADbBQAgMQAA3gUAIDIAAN0FACBzAADcBQAgdAAA3wUAINgCAADBBAAgC7cCAAD7AwAwuAIAAPMCABC5AgAA-wMAMLoCAQDTAwAhwwJAANkDACHEAkAA2QMAIdMCAQDTAwAh1QIBANMDACHWAgEA0wMAIdcCAgDYAwAh2AIBANQDACEDAAAAEgAgAQAA8gIAMDAAAPMCACADAAAAEgAgAQAAEwAwAgAAFAAgAQAAABgAIAEAAAAYACADAAAAFgAgAQAAFwAwAgAAGAAgAwAAABYAIAEAABcAMAIAABgAIAMAAAAWACABAAAXADACAAAYACAECAAA2gUAIA0AALwFACDUAgEAAAAB1QIBAAAAAQEkAAD7AgAgAtQCAQAAAAHVAgEAAAABASQAAP0CADABJAAA_QIAMAQIAADZBQAgDQAAugUAINQCAQDHBAAh1QIBAMcEACECAAAAGAAgJAAAgAMAIALUAgEAxwQAIdUCAQDHBAAhAgAAABYAICQAAIIDACACAAAAFgAgJAAAggMAIAMAAAAYACArAAD7AgAgLAAAgAMAIAEAAAAYACABAAAAFgAgAxEAANYFACAxAADYBQAgMgAA1wUAIAW3AgAA-gMAMLgCAACJAwAQuQIAAPoDADDUAgEA0wMAIdUCAQDTAwAhAwAAABYAIAEAAIgDADAwAACJAwAgAwAAABYAIAEAABcAMAIAABgAIA0DAADxAwAgBwAA8gMAIAoAAPMDACASAAD5AwAgtwIAAPgDADC4AgAANwAQuQIAAPgDADC6AgEAAAABuwIBAOoDACG8AgEA6gMAIcICAQAAAAHDAkAA8AMAIcQCQADwAwAhAQAAAIwDACABAAAAjAMAIAYDAACeBQAgBwAAnwUAIAoAAKAFACASAADVBQAguwIAAMEEACC8AgAAwQQAIAMAAAA3ACABAACPAwAwAgAAjAMAIAMAAAA3ACABAACPAwAwAgAAjAMAIAMAAAA3ACABAACPAwAwAgAAjAMAIAoDAADRBQAgBwAA0gUAIAoAANMFACASAADUBQAgugIBAAAAAbsCAQAAAAG8AgEAAAABwgIBAAAAAcMCQAAAAAHEAkAAAAABASQAAJMDACAGugIBAAAAAbsCAQAAAAG8AgEAAAABwgIBAAAAAcMCQAAAAAHEAkAAAAABASQAAJUDADABJAAAlQMAMAoDAACrBQAgBwAArAUAIAoAAK0FACASAACuBQAgugIBAMcEACG7AgEAyAQAIbwCAQDIBAAhwgIBAMcEACHDAkAAzQQAIcQCQADNBAAhAgAAAIwDACAkAACYAwAgBroCAQDHBAAhuwIBAMgEACG8AgEAyAQAIcICAQDHBAAhwwJAAM0EACHEAkAAzQQAIQIAAAA3ACAkAACaAwAgAgAAADcAICQAAJoDACADAAAAjAMAICsAAJMDACAsAACYAwAgAQAAAIwDACABAAAANwAgBREAAKgFACAxAACqBQAgMgAAqQUAILsCAADBBAAgvAIAAMEEACAJtwIAAPcDADC4AgAAoQMAELkCAAD3AwAwugIBANMDACG7AgEA1AMAIbwCAQDUAwAhwgIBANMDACHDAkAA2QMAIcQCQADZAwAhAwAAADcAIAEAAKADADAwAAChAwAgAwAAADcAIAEAAI8DADACAACMAwAgAQAAACEAIAEAAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAMAAAAfACABAAAgADACAAAhACAEBgAApwUAIA0AAOAEACDTAgEAAAAB1AIBAAAAAQEkAACpAwAgAtMCAQAAAAHUAgEAAAABASQAAKsDADABJAAAqwMAMAQGAACmBQAgDQAA3gQAINMCAQDHBAAh1AIBAMcEACECAAAAIQAgJAAArgMAIALTAgEAxwQAIdQCAQDHBAAhAgAAAB8AICQAALADACACAAAAHwAgJAAAsAMAIAMAAAAhACArAACpAwAgLAAArgMAIAEAAAAhACABAAAAHwAgAxEAAKMFACAxAAClBQAgMgAApAUAIAW3AgAA9gMAMLgCAAC3AwAQuQIAAPYDADDTAgEA0wMAIdQCAQDTAwAhAwAAAB8AIAEAALYDADAwAAC3AwAgAwAAAB8AIAEAACAAMAIAACEAIBMDAADxAwAgEgAA9QMAIBQAAPIDACAVAADzAwAgFgAA9AMAILcCAADpAwAwuAIAAAsAELkCAADpAwAwugIBAAAAAbsCAQDqAwAhvAIBAOoDACG9AgEA6wMAIb4CEADsAwAhvwIgAO0DACHAAggA7gMAIcECAgDvAwAhwgIBAAAAAcMCQADwAwAhxAJAAPADACEBAAAAugMAIAEAAAC6AwAgBwMAAJ4FACASAACiBQAgFAAAnwUAIBUAAKAFACAWAAChBQAguwIAAMEEACC8AgAAwQQAIAMAAAALACABAAC9AwAwAgAAugMAIAMAAAALACABAAC9AwAwAgAAugMAIAMAAAALACABAAC9AwAwAgAAugMAIBADAACZBQAgEgAAnQUAIBQAAJoFACAVAACbBQAgFgAAnAUAILoCAQAAAAG7AgEAAAABvAIBAAAAAb0CAQAAAAG-AhAAAAABvwIgAAAAAcACCAAAAAHBAgIAAAABwgIBAAAAAcMCQAAAAAHEAkAAAAABASQAAMEDACALugIBAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb4CEAAAAAG_AiAAAAABwAIIAAAAAcECAgAAAAHCAgEAAAABwwJAAAAAAcQCQAAAAAEBJAAAwwMAMAEkAADDAwAwEAMAAM4EACASAADSBAAgFAAAzwQAIBUAANAEACAWAADRBAAgugIBAMcEACG7AgEAyAQAIbwCAQDIBAAhvQIBAMcEACG-AhAAyQQAIb8CIADKBAAhwAIIAMsEACHBAgIAzAQAIcICAQDHBAAhwwJAAM0EACHEAkAAzQQAIQIAAAC6AwAgJAAAxgMAIAu6AgEAxwQAIbsCAQDIBAAhvAIBAMgEACG9AgEAxwQAIb4CEADJBAAhvwIgAMoEACHAAggAywQAIcECAgDMBAAhwgIBAMcEACHDAkAAzQQAIcQCQADNBAAhAgAAAAsAICQAAMgDACACAAAACwAgJAAAyAMAIAMAAAC6AwAgKwAAwQMAICwAAMYDACABAAAAugMAIAEAAAALACAHEQAAwgQAIDEAAMUEACAyAADEBAAgcwAAwwQAIHQAAMYEACC7AgAAwQQAILwCAADBBAAgDrcCAADSAwAwuAIAAM8DABC5AgAA0gMAMLoCAQDTAwAhuwIBANQDACG8AgEA1AMAIb0CAQDTAwAhvgIQANUDACG_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_AiAA7QMAIcACCADuAwAhwQICAO8DACHCAgEA6wMAIcMCQADwAwAhxAJAAPADACELxQIBAAAAAcYCAQAAAAXHAgEAAAAFyAIBAAAAAckCAQAAAAHKAgEAAAABywIBAAAAAcwCAQDmAwAhzQIBAAAAAc4CAQAAAAHPAgEAAAABC8UCAQAAAAHGAgEAAAAExwIBAAAABMgCAQAAAAHJAgEAAAABygIBAAAAAcsCAQAAAAHMAgEA6AMAIc0CAQAAAAHOAgEAAAABzwIBAAAAAQjFAhAAAAABxgIQAAAABMcCEAAAAATIAhAAAAAByQIQAAAAAcoCEAAAAAHLAhAAAAABzAIQAOMDACECxQIgAAAAAcwCIADhAwAhCMUCCAAAAAHGAggAAAAExwIIAAAABMgCCAAAAAHJAggAAAABygIIAAAAAcsCCAAAAAHMAggA3gMAIQjFAgIAAAABxgICAAAABMcCAgAAAATIAgIAAAAByQICAAAAAcoCAgAAAAHLAgIAAAABzAICANsDACEIxQJAAAAAAcYCQAAAAATHAkAAAAAEyAJAAAAAAckCQAAAAAHKAkAAAAABywJAAAAAAcwCQADcAwAhFQQAAKUEACAFAACmBAAgFwAApwQAIBgAAKgEACAdAACGBAAgHgAAhQQAILcCAACiBAAwuAIAAEoAELkCAACiBAAwugIBAOsDACHDAkAA8AMAIcQCQADwAwAh4wIBAOsDACHrAgEA6wMAIfUCAACkBJADIosDIADtAwAhjAMBAOoDACGOAwAAowSOAyOQAyAA7QMAIZQDAABKACCVAwAASgAgA9ACAAANACDRAgAADQAg0gIAAA0AIAPQAgAAEgAg0QIAABIAINICAAASACAD0AIAAC4AINECAAAuACDSAgAALgAgA9ACAAAfACDRAgAAHwAg0gIAAB8AIAW3AgAA9gMAMLgCAAC3AwAQuQIAAPYDADDTAgEA0wMAIdQCAQDTAwAhCbcCAAD3AwAwuAIAAKEDABC5AgAA9wMAMLoCAQDTAwAhuwIBANQDACG8AgEA1AMAIcICAQDTAwAhwwJAANkDACHEAkAA2QMAIQ0DAADxAwAgBwAA8gMAIAoAAPMDACASAAD5AwAgtwIAAPgDADC4AgAANwAQuQIAAPgDADC6AgEA6wMAIbsCAQDqAwAhvAIBAOoDACHCAgEA6wMAIcMCQADwAwAhxAJAAPADACED0AIAABYAINECAAAWACDSAgAAFgAgBbcCAAD6AwAwuAIAAIkDABC5AgAA-gMAMNQCAQDTAwAh1QIBANMDACELtwIAAPsDADC4AgAA8wIAELkCAAD7AwAwugIBANMDACHDAkAA2QMAIcQCQADZAwAh0wIBANMDACHVAgEA0wMAIdYCAQDTAwAh1wICANgDACHYAgEA1AMAIQq3AgAA_AMAMLgCAADdAgAQuQIAAPwDADC6AgEA0wMAIcMCQADZAwAhxAJAANkDACHZAgEA0wMAIdoCAQDTAwAh2wIBANMDACHcAiAA1gMAIQm3AgAA_QMAMLgCAADHAgAQuQIAAP0DADC6AgEA0wMAIcICAQDTAwAhwwJAANkDACHdAgEA0wMAId4CAQDTAwAh3wJAAP4DACELEQAA5QMAIDEAAIAEACAyAACABAAgxQJAAAAAAcYCQAAAAAXHAkAAAAAFyAJAAAAAAckCQAAAAAHKAkAAAAABywJAAAAAAcwCQAD_AwAhCxEAAOUDACAxAACABAAgMgAAgAQAIMUCQAAAAAHGAkAAAAAFxwJAAAAABcgCQAAAAAHJAkAAAAABygJAAAAAAcsCQAAAAAHMAkAA_wMAIQjFAkAAAAABxgJAAAAABccCQAAAAAXIAkAAAAAByQJAAAAAAcoCQAAAAAHLAkAAAAABzAJAAIAEACEJtwIAAIEEADC4AgAAtAIAELkCAACBBAAwugIBAOsDACHCAgEA6wMAIcMCQADwAwAh3QIBAOsDACHeAgEA6wMAId8CQACCBAAhCMUCQAAAAAHGAkAAAAAFxwJAAAAABcgCQAAAAAHJAkAAAAABygJAAAAAAcsCQAAAAAHMAkAAgAQAIQe3AgAAgwQAMLgCAACuAgAQuQIAAIMEADC6AgEA0wMAIcMCQADZAwAhxAJAANkDACHgAkAA_gMAIQkbAACFBAAgHAAAhgQAILcCAACEBAAwuAIAAJsCABC5AgAAhAQAMLoCAQDrAwAhwwJAAPADACHEAkAA8AMAIeACQACCBAAhA9ACAAA9ACDRAgAAPQAg0gIAAD0AIAPQAgAAOQAg0QIAADkAINICAAA5ACAHtwIAAIcEADC4AgAAlQIAELkCAACHBAAwugIBANMDACHCAgEA0wMAIdkCAQDTAwAh4QJAANkDACELtwIAAIgEADC4AgAA_wEAELkCAACIBAAwugIBANMDACHDAkAA2QMAIeICAQDTAwAh4wIBANMDACHkAgEA1AMAIeUCAQDTAwAh5gIAAIkEACDnAgEA0wMAIQTFAgEAAAAF6AIBAAAAAekCAQAAAATqAgEAAAAEC7cCAACKBAAwuAIAAOwBABC5AgAAigQAMLoCAQDrAwAhwwJAAPADACHiAgEA6wMAIeMCAQDrAwAh5AIBAOoDACHlAgEA6wMAIeYCAACJBAAg5wIBAOsDACENtwIAAIsEADC4AgAA5gEAELkCAACLBAAwugIBANMDACG_AiAA1gMAIcMCQADZAwAhxAJAANkDACHrAgEA0wMAIewCAQDUAwAh7QIBANQDACHuAgEA1AMAIe8CAACJBAAg8AIBANQDACEQtwIAAIwEADC4AgAAzgEAELkCAACMBAAwugIBANMDACHDAkAA2QMAIcQCQADZAwAh0wIBANMDACHUAgEA0wMAIdUCAQDTAwAh8QJAANkDACHyAkAA2QMAIfMCQADZAwAh9QIAAI0E9QIi9wIAAI4E9wIi-AIBANQDACH5AgEA1AMAIQcRAADbAwAgMQAAkgQAIDIAAJIEACDFAgAAAPUCAsYCAAAA9QIIxwIAAAD1AgjMAgAAkQT1AiIHEQAA2wMAIDEAAJAEACAyAACQBAAgxQIAAAD3AgLGAgAAAPcCCMcCAAAA9wIIzAIAAI8E9wIiBxEAANsDACAxAACQBAAgMgAAkAQAIMUCAAAA9wICxgIAAAD3AgjHAgAAAPcCCMwCAACPBPcCIgTFAgAAAPcCAsYCAAAA9wIIxwIAAAD3AgjMAgAAkAT3AiIHEQAA2wMAIDEAAJIEACAyAACSBAAgxQIAAAD1AgLGAgAAAPUCCMcCAAAA9QIIzAIAAJEE9QIiBMUCAAAA9QICxgIAAAD1AgjHAgAAAPUCCMwCAACSBPUCIgy3AgAAkwQAMLgCAAC4AQAQuQIAAJMEADC6AgEA0wMAIcMCQADZAwAhxAJAANkDACHTAgEA0wMAIfICAQDTAwAh8wIBANMDACH7AgAAlAT7AiL8AgIA2AMAIf0CIADWAwAhBxEAANsDACAxAACWBAAgMgAAlgQAIMUCAAAA-wICxgIAAAD7AgjHAgAAAPsCCMwCAACVBPsCIgcRAADbAwAgMQAAlgQAIDIAAJYEACDFAgAAAPsCAsYCAAAA-wIIxwIAAAD7AgjMAgAAlQT7AiIExQIAAAD7AgLGAgAAAPsCCMcCAAAA-wIIzAIAAJYE-wIiCbcCAACXBAAwuAIAAKIBABC5AgAAlwQAMLoCAQDTAwAhwwJAANkDACHEAkAA2QMAIf4CAQDTAwAh_wIBANMDACGAA0AA2QMAIQm3AgAAmAQAMLgCAACPAQAQuQIAAJgEADC6AgEA6wMAIcMCQADwAwAhxAJAAPADACH-AgEA6wMAIf8CAQDrAwAhgANAAPADACEQtwIAAJkEADC4AgAAiQEAELkCAACZBAAwugIBANMDACHCAgEA0wMAIcMCQADZAwAhxAJAANkDACHdAgEA1AMAId4CAQDUAwAhgQMBANMDACGCAwEA0wMAIYMDAQDUAwAhhANAAP4DACGFA0AA_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_AiAA7QMAIcMCQADwAwAhxAJAAPADACHrAgEA6wMAIewCAQDqAwAh7QIBAOoDACHuAgEA6gMAIe8CAACJBAAg8AIBAOoDACGUAwAAGgAglQMAABoAIAPQAgAAGgAg0QIAABoAINICAAAaACAC1AIBAAAAAdUCAQAAAAEHCAAAuAQAIA0AALIEACC3AgAAtwQAMLgCAAAWABC5AgAAtwQAMNQCAQDrAwAh1QIBAOsDACEPAwAA8QMAIAcAAPIDACAKAADzAwAgEgAA-QMAILcCAAD4AwAwuAIAADcAELkCAAD4AwAwugIBAOsDACG7AgEA6gMAIbwCAQDqAwAhwgIBAOsDACHDAkAA8AMAIcQCQADwAwAhlAMAADcAIJUDAAA3ACAOBgAArwQAIAgAALgEACAJAAC6BAAgtwIAALkEADC4AgAAEgAQuQIAALkEADC6AgEA6wMAIcMCQADwAwAhxAJAAPADACHTAgEA6wMAIdUCAQDrAwAh1gIBAOsDACHXAgIA7wMAIdgCAQDqAwAhFgYAAK8EACAIAAC4BAAgDQAAsgQAIBMAAL4EACC3AgAAuwQAMLgCAAANABC5AgAAuwQAMLoCAQDrAwAhwwJAAPADACHEAkAA8AMAIdMCAQDrAwAh1AIBAOsDACHVAgEA6wMAIfECQADwAwAh8gJAAPADACHzAkAA8AMAIfUCAAC8BPUCIvcCAAC9BPcCIvgCAQDqAwAh-QIBAOoDACGUAwAADQAglQMAAA0AIBQGAACvBAAgCAAAuAQAIA0AALIEACATAAC-BAAgtwIAALsEADC4AgAADQAQuQIAALsEADC6AgEA6wMAIcMCQADwAwAhxAJAAPADACHTAgEA6wMAIdQCAQDrAwAh1QIBAOsDACHxAkAA8AMAIfICQADwAwAh8wJAAPADACH1AgAAvAT1AiL3AgAAvQT3AiL4AgEA6gMAIfkCAQDqAwAhBMUCAAAA9QICxgIAAAD1AgjHAgAAAPUCCMwCAACSBPUCIgTFAgAAAPcCAsYCAAAA9wIIxwIAAAD3AgjMAgAAkAT3AiIQBgAArwQAIAgAALgEACAJAAC6BAAgtwIAALkEADC4AgAAEgAQuQIAALkEADC6AgEA6wMAIcMCQADwAwAhxAJAAPADACHTAgEA6wMAIdUCAQDrAwAh1gIBAOsDACHXAgIA7wMAIdgCAQDqAwAhlAMAABIAIJUDAAASACARAwAA8QMAILcCAAC_BAAwuAIAAAcAELkCAAC_BAAwugIBAOsDACHCAgEA6wMAIcMCQADwAwAhxAJAAPADACHdAgEA6gMAId4CAQDqAwAhgQMBAOsDACGCAwEA6wMAIYMDAQDqAwAhhANAAIIEACGFA0AAggQAIYYDAQDqAwAhhwMBAOoDACEMAwAA8QMAILcCAADABAAwuAIAAAMAELkCAADABAAwugIBAOsDACHCAgEA6wMAIcMCQADwAwAhxAJAAPADACGAA0AA8AMAIYgDAQDrAwAhiQMBAOoDACGKAwEA6gMAIQAAAAAAAAGZAwEAAAABAZkDAQAAAAEFmQMQAAAAAaADEAAAAAGhAxAAAAABogMQAAAAAaMDEAAAAAEBmQMgAAAAAQWZAwgAAAABoAMIAAAAAaEDCAAAAAGiAwgAAAABowMIAAAAAQWZAwIAAAABoAMCAAAAAaEDAgAAAAGiAwIAAAABowMCAAAAAQGZA0AAAAABBSsAAIEIACAsAACmCAAglgMAAIIIACCXAwAApQgAIJwDAAABACALKwAA_gQAMCwAAIMFADCWAwAA_wQAMJcDAACABQAwmAMAAIEFACCZAwAAggUAMJoDAACCBQAwmwMAAIIFADCcAwAAggUAMJ0DAACEBQAwngMAAIUFADALKwAA7gQAMCwAAPMEADCWAwAA7wQAMJcDAADwBAAwmAMAAPEEACCZAwAA8gQAMJoDAADyBAAwmwMAAPIEADCcAwAA8gQAMJ0DAAD0BAAwngMAAPUEADALKwAA4QQAMCwAAOYEADCWAwAA4gQAMJcDAADjBAAwmAMAAOQEACCZAwAA5QQAMJoDAADlBAAwmwMAAOUEADCcAwAA5QQAMJ0DAADnBAAwngMAAOgEADALKwAA0wQAMCwAANgEADCWAwAA1AQAMJcDAADVBAAwmAMAANYEACCZAwAA1wQAMJoDAADXBAAwmwMAANcEADCcAwAA1wQAMJ0DAADZBAAwngMAANoEADACDQAA4AQAINQCAQAAAAECAAAAIQAgKwAA3wQAIAMAAAAhACArAADfBAAgLAAA3QQAIAEkAACkCAAwCAYAAK8EACANAACyBAAgtwIAALEEADC4AgAAHwAQuQIAALEEADDTAgEA6wMAIdQCAQDrAwAhkgMAALAEACACAAAAIQAgJAAA3QQAIAIAAADbBAAgJAAA3AQAIAW3AgAA2gQAMLgCAADbBAAQuQIAANoEADDTAgEA6wMAIdQCAQDrAwAhBbcCAADaBAAwuAIAANsEABC5AgAA2gQAMNMCAQDrAwAh1AIBAOsDACEB1AIBAMcEACECDQAA3gQAINQCAQDHBAAhBSsAAJ8IACAsAACiCAAglgMAAKAIACCXAwAAoQgAIJwDAAAdACACDQAA4AQAINQCAQAAAAEDKwAAnwgAIJYDAACgCAAgnAMAAB0AIAi6AgEAAAABwwJAAAAAAcQCQAAAAAHyAgEAAAAB8wIBAAAAAfsCAAAA-wIC_AICAAAAAf0CIAAAAAECAAAAMAAgKwAA7QQAIAMAAAAwACArAADtBAAgLAAA7AQAIAEkAACeCAAwDQYAAK8EACC3AgAArQQAMLgCAAAuABC5AgAArQQAMLoCAQAAAAHDAkAA8AMAIcQCQADwAwAh0wIBAOsDACHyAgEA6wMAIfMCAQDrAwAh-wIAAK4E-wIi_AICAO8DACH9AiAA7QMAIQIAAAAwACAkAADsBAAgAgAAAOkEACAkAADqBAAgDLcCAADoBAAwuAIAAOkEABC5AgAA6AQAMLoCAQDrAwAhwwJAAPADACHEAkAA8AMAIdMCAQDrAwAh8gIBAOsDACHzAgEA6wMAIfsCAACuBPsCIvwCAgDvAwAh_QIgAO0DACEMtwIAAOgEADC4AgAA6QQAELkCAADoBAAwugIBAOsDACHDAkAA8AMAIcQCQADwAwAh0wIBAOsDACHyAgEA6wMAIfMCAQDrAwAh-wIAAK4E-wIi_AICAO8DACH9AiAA7QMAIQi6AgEAxwQAIcMCQADNBAAhxAJAAM0EACHyAgEAxwQAIfMCAQDHBAAh-wIAAOsE-wIi_AICAMwEACH9AiAAygQAIQGZAwAAAPsCAgi6AgEAxwQAIcMCQADNBAAhxAJAAM0EACHyAgEAxwQAIfMCAQDHBAAh-wIAAOsE-wIi_AICAMwEACH9AiAAygQAIQi6AgEAAAABwwJAAAAAAcQCQAAAAAHyAgEAAAAB8wIBAAAAAfsCAAAA-wIC_AICAAAAAf0CIAAAAAEJCAAA_AQAIAkAAP0EACC6AgEAAAABwwJAAAAAAcQCQAAAAAHVAgEAAAAB1gIBAAAAAdcCAgAAAAHYAgEAAAABAgAAABQAICsAAPsEACADAAAAFAAgKwAA-wQAICwAAPgEACABJAAAnQgAMA4GAACvBAAgCAAAuAQAIAkAALoEACC3AgAAuQQAMLgCAAASABC5AgAAuQQAMLoCAQAAAAHDAkAA8AMAIcQCQADwAwAh0wIBAOsDACHVAgEA6wMAIdYCAQAAAAHXAgIA7wMAIdgCAQDqAwAhAgAAABQAICQAAPgEACACAAAA9gQAICQAAPcEACALtwIAAPUEADC4AgAA9gQAELkCAAD1BAAwugIBAOsDACHDAkAA8AMAIcQCQADwAwAh0wIBAOsDACHVAgEA6wMAIdYCAQDrAwAh1wICAO8DACHYAgEA6gMAIQu3AgAA9QQAMLgCAAD2BAAQuQIAAPUEADC6AgEA6wMAIcMCQADwAwAhxAJAAPADACHTAgEA6wMAIdUCAQDrAwAh1gIBAOsDACHXAgIA7wMAIdgCAQDqAwAhB7oCAQDHBAAhwwJAAM0EACHEAkAAzQQAIdUCAQDHBAAh1gIBAMcEACHXAgIAzAQAIdgCAQDIBAAhCQgAAPkEACAJAAD6BAAgugIBAMcEACHDAkAAzQQAIcQCQADNBAAh1QIBAMcEACHWAgEAxwQAIdcCAgDMBAAh2AIBAMgEACEFKwAAlQgAICwAAJsIACCWAwAAlggAIJcDAACaCAAgnAMAAIwDACAFKwAAkwgAICwAAJgIACCWAwAAlAgAIJcDAACXCAAgnAMAAA8AIAkIAAD8BAAgCQAA_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_gQAMJYDAAD_BAAwmAMAAIEFACCcAwAAggUAMAQrAADuBAAwlgMAAO8EADCYAwAA8QQAIJwDAADyBAAwBCsAAOEEADCWAwAA4gQAMJgDAADkBAAgnAMAAOUEADAEKwAA0wQAMJYDAADUBAAwmAMAANYEACCcAwAA1wQAMAgEAACqBwAgBQAAqwcAIBcAAKwHACAYAACtBwAgHQAAjQYAIB4AAIwGACCMAwAAwQQAII4DAADBBAAgAAAAAAAAAAUrAAD8BwAgLAAA_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_gUAMCwAAIMGADCWAwAA_wUAMJcDAACABgAwmAMAAIEGACCZAwAAggYAMJoDAACCBgAwmwMAAIIGADCcAwAAggYAMJ0DAACEBgAwngMAAIUGADALKwAA8AUAMCwAAPUFADCWAwAA8QUAMJcDAADyBQAwmAMAAPMFACCZAwAA9AUAMJoDAAD0BQAwmwMAAPQFADCcAwAA9AUAMJ0DAAD2BQAwngMAAPcFADAEAwAA_QUAILoCAQAAAAHCAgEAAAAB4QJAAAAAAQIAAAA7ACArAAD8BQAgAwAAADsAICsAAPwFACAsAAD6BQAgASQAANoHADAKAwAA8QMAIBkAAKoEACC3AgAArAQAMLgCAAA5ABC5AgAArAQAMLoCAQAAAAHCAgEA6wMAIdkCAQDrAwAh4QJAAPADACGRAwAAqwQAIAIAAAA7ACAkAAD6BQAgAgAAAPgFACAkAAD5BQAgB7cCAAD3BQAwuAIAAPgFABC5AgAA9wUAMLoCAQDrAwAhwgIBAOsDACHZAgEA6wMAIeECQADwAwAhB7cCAAD3BQAwuAIAAPgFABC5AgAA9wUAMLoCAQDrAwAhwgIBAOsDACHZAgEA6wMAIeECQADwAwAhA7oCAQDHBAAhwgIBAMcEACHhAkAAzQQAIQQDAAD7BQAgugIBAMcEACHCAgEAxwQAIeECQADNBAAhBSsAANUHACAsAADYBwAglgMAANYHACCXAwAA1wcAIJwDAAABACAEAwAA_QUAILoCAQAAAAHCAgEAAAAB4QJAAAAAAQMrAADVBwAglgMAANYHACCcAwAAAQAgBxoAAOYFACC6AgEAAAABwwJAAAAAAcQCQAAAAAHaAgEAAAAB2wIBAAAAAdwCIAAAAAECAAAAPwAgKwAAiQYAIAMAAAA_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_AiAA7QMAIcMCQADwAwAhxAJAAPADACHrAgEA6wMAIewCAQDqAwAh7QIBAOoDACHuAgEA6gMAIe8CAACJBAAg8AIBAOoDACENtwIAAMMGADC4AgAAxAYAELkCAADDBgAwugIBAOsDACG_AiAA7QMAIcMCQADwAwAhxAJAAPADACHrAgEA6wMAIewCAQDqAwAh7QIBAOoDACHuAgEA6gMAIe8CAACJBAAg8AIBAOoDACEJugIBAMcEACG_AiAAygQAIcMCQADNBAAhxAJAAM0EACHrAgEAxwQAIewCAQDIBAAh7QIBAMgEACHuAgEAyAQAIe8CAACbBgAgDQwAAJ0GACAOAACeBgAgDwAAnwYAIBAAAKAGACC6AgEAxwQAIb8CIADKBAAhwwJAAM0EACHEAkAAzQQAIesCAQDHBAAh7AIBAMgEACHtAgEAyAQAIe4CAQDIBAAh7wIAAJsGACANDAAAyQYAIA4AAMoGACAPAADLBgAgEAAAzAYAILoCAQAAAAG_AiAAAAABwwJAAAAAAcQCQAAAAAHrAgEAAAAB7AIBAAAAAe0CAQAAAAHuAgEAAAAB7wIAAMgGACABmQMBAAAABAQrAAC8BgAwlgMAAL0GADCYAwAAvwYAIJwDAADABgAwBCsAALMGADCWAwAAtAYAMJgDAAC2BgAgnAMAANcEADAEKwAAqgYAMJYDAACrBgAwmAMAAK0GACCcAwAAswUAMAQrAAChBgAwlgMAAKIGADCYAwAApAYAIJwDAACCBQAwAysAAMYHACCWAwAAxwcAIJwDAAAdACAAAAAAAAAAAAUrAADBBwAgLAAAxAcAIJYDAADCBwAglwMAAMMHACCcAwAAugMAIAMrAADBBwAglgMAAMIHACCcAwAAugMAIAAAAAAAAAUrAAC8BwAgLAAAvwcAIJYDAAC9BwAglwMAAL4HACCcAwAAAQAgAysAALwHACCWAwAAvQcAIJwDAAABACAAAAAFKwAAtwcAICwAALoHACCWAwAAuAcAIJcDAAC5BwAgnAMAAAEAIAMrAAC3BwAglgMAALgHACCcAwAAAQAgAAAAAZkDAAAAjgMDAZkDAAAAkAMCCysAAJgHADAsAACdBwAwlgMAAJkHADCXAwAAmgcAMJgDAACbBwAgmQMAAJwHADCaAwAAnAcAMJsDAACcBwAwnAMAAJwHADCdAwAAngcAMJ4DAACfBwAwCysAAIwHADAsAACRBwAwlgMAAI0HADCXAwAAjgcAMJgDAACPBwAgmQMAAJAHADCaAwAAkAcAMJsDAACQBwAwnAMAAJAHADCdAwAAkgcAMJ4DAACTBwAwBysAAIcHACAsAACKBwAglgMAAIgHACCXAwAAiQcAIJoDAAALACCbAwAACwAgnAMAALoDACAHKwAAggcAICwAAIUHACCWAwAAgwcAIJcDAACEBwAgmgMAADcAIJsDAAA3ACCcAwAAjAMAIAsrAAD5BgAwLAAA_QYAMJYDAAD6BgAwlwMAAPsGADCYAwAA_AYAIJkDAAD0BQAwmgMAAPQFADCbAwAA9AUAMJwDAAD0BQAwnQMAAP4GADCeAwAA9wUAMAsrAADwBgAwLAAA9AYAMJYDAADxBgAwlwMAAPIGADCYAwAA8wYAIJkDAACCBgAwmgMAAIIGADCbAwAAggYAMJwDAACCBgAwnQMAAPUGADCeAwAAhQYAMAcZAADlBQAgugIBAAAAAcMCQAAAAAHEAkAAAAAB2QIBAAAAAdsCAQAAAAHcAiAAAAABAgAAAD8AICsAAPgGACADAAAAPwAgKwAA-AYAICwAAPcGACABJAAAtgcAMAIAAAA_ACAkAAD3BgAgAgAAAIYGACAkAAD2BgAgBroCAQDHBAAhwwJAAM0EACHEAkAAzQQAIdkCAQDHBAAh2wIBAMcEACHcAiAAygQAIQcZAADjBQAgugIBAMcEACHDAkAAzQQAIcQCQADNBAAh2QIBAMcEACHbAgEAxwQAIdwCIADKBAAhBxkAAOUFACC6AgEAAAABwwJAAAAAAcQCQAAAAAHZAgEAAAAB2wIBAAAAAdwCIAAAAAEEGQAAkgYAILoCAQAAAAHZAgEAAAAB4QJAAAAAAQIAAAA7ACArAACBBwAgAwAAADsAICsAAIEHACAsAACABwAgASQAALUHADACAAAAOwAgJAAAgAcAIAIAAAD4BQAgJAAA_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_AiAAygQAIcMCQADNBAAhxAJAAM0EACHrAgEAxwQAIewCAQDIBAAh7QIBAMgEACHuAgEAyAQAIe8CAACbBgAg8AIBAMgEACEOCwAAnAYAIAwAAJ0GACAOAACeBgAgEAAAoAYAILoCAQDHBAAhvwIgAMoEACHDAkAAzQQAIcQCQADNBAAh6wIBAMcEACHsAgEAyAQAIe0CAQDIBAAh7gIBAMgEACHvAgAAmwYAIPACAQDIBAAhAdQCAQAAAAEDAAAASgAgKwAA6gcAICwAAPsHACARAAAASgAgBAAA6gYAIAUAAOsGACAXAADsBgAgHQAA7gYAIB4AAO8GACAkAAD7BwAgugIBAMcEACHDAkAAzQQAIcQCQADNBAAh4wIBAMcEACHrAgEAxwQAIfUCAADpBpADIosDIADKBAAhjAMBAMgEACGOAwAA6AaOAyOQAyAAygQAIQ8EAADqBgAgBQAA6wYAIBcAAOwGACAdAADuBgAgHgAA7wYAILoCAQDHBAAhwwJAAM0EACHEAkAAzQQAIeMCAQDHBAAh6wIBAMcEACH1AgAA6QaQAyKLAyAAygQAIYwDAQDIBAAhjgMAAOgGjgMjkAMgAMoEACEPAwAAmQUAIBQAAJoFACAVAACbBQAgFgAAnAUAILoCAQAAAAG7AgEAAAABvAIBAAAAAb0CAQAAAAG-AhAAAAABvwIgAAAAAcACCAAAAAHBAgIAAAABwgIBAAAAAcMCQAAAAAHEAkAAAAABAgAAALoDACArAAD8BwAgAwAAAAsAICsAAPwHACAsAACACAAgEQAAAAsAIAMAAM4EACAUAADPBAAgFQAA0AQAIBYAANEEACAkAACACAAgugIBAMcEACG7AgEAyAQAIbwCAQDIBAAhvQIBAMcEACG-AhAAyQQAIb8CIADKBAAhwAIIAMsEACHBAgIAzAQAIcICAQDHBAAhwwJAAM0EACHEAkAAzQQAIQ8DAADOBAAgFAAAzwQAIBUAANAEACAWAADRBAAgugIBAMcEACG7AgEAyAQAIbwCAQDIBAAhvQIBAMcEACG-AhAAyQQAIb8CIADKBAAhwAIIAMsEACHBAgIAzAQAIcICAQDHBAAhwwJAAM0EACHEAkAAzQQAIQ8EAACkBwAgBQAApQcAIBgAAKcHACAdAACoBwAgHgAAqQcAILoCAQAAAAHDAkAAAAABxAJAAAAAAeMCAQAAAAHrAgEAAAAB9QIAAACQAwKLAyAAAAABjAMBAAAAAY4DAAAAjgMDkAMgAAAAAQIAAAABACArAACBCAAgDgsAAM0GACAMAADJBgAgDgAAygYAIA8AAMsGACC6AgEAAAABvwIgAAAAAcMCQAAAAAHEAkAAAAAB6wIBAAAAAewCAQAAAAHtAgEAAAAB7gIBAAAAAe8CAADIBgAg8AIBAAAAAQIAAAAdACArAACDCAAgCQMAANEFACAKAADTBQAgEgAA1AUAILoCAQAAAAG7AgEAAAABvAIBAAAAAcICAQAAAAHDAkAAAAABxAJAAAAAAQIAAACMAwAgKwAAhQgAIA8DAACZBQAgEgAAnQUAIBQAAJoFACAWAACcBQAgugIBAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb4CEAAAAAG_AiAAAAABwAIIAAAAAcECAgAAAAHCAgEAAAABwwJAAAAAAcQCQAAAAAECAAAAugMAICsAAIcIACADAAAACwAgKwAAhwgAICwAAIsIACARAAAACwAgAwAAzgQAIBIAANIEACAUAADPBAAgFgAA0QQAICQAAIsIACC6AgEAxwQAIbsCAQDIBAAhvAIBAMgEACG9AgEAxwQAIb4CEADJBAAhvwIgAMoEACHAAggAywQAIcECAgDMBAAhwgIBAMcEACHDAkAAzQQAIcQCQADNBAAhDwMAAM4EACASAADSBAAgFAAAzwQAIBYAANEEACC6AgEAxwQAIbsCAQDIBAAhvAIBAMgEACG9AgEAxwQAIb4CEADJBAAhvwIgAMoEACHAAggAywQAIcECAgDMBAAhwgIBAMcEACHDAkAAzQQAIcQCQADNBAAhAwAAABoAICsAAIMIACAsAACOCAAgEAAAABoAIAsAAJwGACAMAACdBgAgDgAAngYAIA8AAJ8GACAkAACOCAAgugIBAMcEACG_AiAAygQAIcMCQADNBAAhxAJAAM0EACHrAgEAxwQAIewCAQDIBAAh7QIBAMgEACHuAgEAyAQAIe8CAACbBgAg8AIBAMgEACEOCwAAnAYAIAwAAJ0GACAOAACeBgAgDwAAnwYAILoCAQDHBAAhvwIgAMoEACHDAkAAzQQAIcQCQADNBAAh6wIBAMcEACHsAgEAyAQAIe0CAQDIBAAh7gIBAMgEACHvAgAAmwYAIPACAQDIBAAhAwAAADcAICsAAIUIACAsAACRCAAgCwAAADcAIAMAAKsFACAKAACtBQAgEgAArgUAICQAAJEIACC6AgEAxwQAIbsCAQDIBAAhvAIBAMgEACHCAgEAxwQAIcMCQADNBAAhxAJAAM0EACEJAwAAqwUAIAoAAK0FACASAACuBQAgugIBAMcEACG7AgEAyAQAIbwCAQDIBAAhwgIBAMcEACHDAkAAzQQAIcQCQADNBAAhDLoCAQAAAAHDAkAAAAABxAJAAAAAAdQCAQAAAAHVAgEAAAAB8QJAAAAAAfICQAAAAAHzAkAAAAAB9QIAAAD1AgL3AgAAAPcCAvgCAQAAAAH5AgEAAAABEAYAANAFACAIAACWBQAgDQAAlwUAILoCAQAAAAHDAkAAAAABxAJAAAAAAdMCAQAAAAHUAgEAAAAB1QIBAAAAAfECQAAAAAHyAkAAAAAB8wJAAAAAAfUCAAAA9QIC9wIAAAD3AgL4AgEAAAAB-QIBAAAAAQIAAAAPACArAACTCAAgCQMAANEFACAHAADSBQAgEgAA1AUAILoCAQAAAAG7AgEAAAABvAIBAAAAAcICAQAAAAHDAkAAAAABxAJAAAAAAQIAAACMAwAgKwAAlQgAIAMAAAANACArAACTCAAgLAAAmQgAIBIAAAANACAGAADOBQAgCAAAiwUAIA0AAIwFACAkAACZCAAgugIBAMcEACHDAkAAzQQAIcQCQADNBAAh0wIBAMcEACHUAgEAxwQAIdUCAQDHBAAh8QJAAM0EACHyAkAAzQQAIfMCQADNBAAh9QIAAIgF9QIi9wIAAIkF9wIi-AIBAMgEACH5AgEAyAQAIRAGAADOBQAgCAAAiwUAIA0AAIwFACC6AgEAxwQAIcMCQADNBAAhxAJAAM0EACHTAgEAxwQAIdQCAQDHBAAh1QIBAMcEACHxAkAAzQQAIfICQADNBAAh8wJAAM0EACH1AgAAiAX1AiL3AgAAiQX3AiL4AgEAyAQAIfkCAQDIBAAhAwAAADcAICsAAJUIACAsAACcCAAgCwAAADcAIAMAAKsFACAHAACsBQAgEgAArgUAICQAAJwIACC6AgEAxwQAIbsCAQDIBAAhvAIBAMgEACHCAgEAxwQAIcMCQADNBAAhxAJAAM0EACEJAwAAqwUAIAcAAKwFACASAACuBQAgugIBAMcEACG7AgEAyAQAIbwCAQDIBAAhwgIBAMcEACHDAkAAzQQAIcQCQADNBAAhB7oCAQAAAAHDAkAAAAABxAJAAAAAAdUCAQAAAAHWAgEAAAAB1wICAAAAAdgCAQAAAAEIugIBAAAAAcMCQAAAAAHEAkAAAAAB8gIBAAAAAfMCAQAAAAH7AgAAAPsCAvwCAgAAAAH9AiAAAAABDgsAAM0GACAMAADJBgAgDwAAywYAIBAAAMwGACC6AgEAAAABvwIgAAAAAcMCQAAAAAHEAkAAAAAB6wIBAAAAAewCAQAAAAHtAgEAAAAB7gIBAAAAAe8CAADIBgAg8AIBAAAAAQIAAAAdACArAACfCAAgAwAAABoAICsAAJ8IACAsAACjCAAgEAAAABoAIAsAAJwGACAMAACdBgAgDwAAnwYAIBAAAKAGACAkAACjCAAgugIBAMcEACG_AiAAygQAIcMCQADNBAAhxAJAAM0EACHrAgEAxwQAIewCAQDIBAAh7QIBAMgEACHuAgEAyAQAIe8CAACbBgAg8AIBAMgEACEOCwAAnAYAIAwAAJ0GACAPAACfBgAgEAAAoAYAILoCAQDHBAAhvwIgAMoEACHDAkAAzQQAIcQCQADNBAAh6wIBAMcEACHsAgEAyAQAIe0CAQDIBAAh7gIBAMgEACHvAgAAmwYAIPACAQDIBAAhAdQCAQAAAAEDAAAASgAgKwAAgQgAICwAAKcIACARAAAASgAgBAAA6gYAIAUAAOsGACAYAADtBgAgHQAA7gYAIB4AAO8GACAkAACnCAAgugIBAMcEACHDAkAAzQQAIcQCQADNBAAh4wIBAMcEACHrAgEAxwQAIfUCAADpBpADIosDIADKBAAhjAMBAMgEACGOAwAA6AaOAyOQAyAAygQAIQ8EAADqBgAgBQAA6wYAIBgAAO0GACAdAADuBgAgHgAA7wYAILoCAQDHBAAhwwJAAM0EACHEAkAAzQQAIeMCAQDHBAAh6wIBAMcEACH1AgAA6QaQAyKLAyAAygQAIYwDAQDIBAAhjgMAAOgGjgMjkAMgAMoEACEHBAYCBQoDEQATFwwEGDgGHTwPHkQRAQMAAQEDAAEGAwABEQAOEjIKFBAFFS0HFjENBAYABAgABg0ACRMsBwUDAAEHEQUKFQcRAAwSGQgDBgAECAAGCQAFAggABg0ACQYLGwkMHgkOIgoPIwgQJAURAAsCBgAEDQAJBAwlAA4mAA8nABAoAAMHKQAKKgASKwABBgAEBBI2ABQzABU0ABY1AAIDAAEZABADEQASG0ARHEEPAhkAEBoAAQIbQgAcQwAEBEUABUYAHUcAHkgAAAAAAxEAGDEAGTIAGgAAAAMRABgxABkyABoBAwABAQMAAQMRAB8xACAyACEAAAADEQAfMQAgMgAhAQMAAQEDAAEDEQAmMQAnMgAoAAAAAxEAJjEAJzIAKAAAAAMRAC4xAC8yADAAAAADEQAuMQAvMgAwAQYABAEGAAQFEQA1MQA4MgA5cwA2dAA3AAAAAAAFEQA1MQA4MgA5cwA2dAA3AwYABAgABg0ACQMGAAQIAAYNAAkDEQA-MQA_MgBAAAAAAxEAPjEAPzIAQAEL2wEJAQvhAQkDEQBFMQBGMgBHAAAAAxEARTEARjIARwAAAAMRAE0xAE4yAE8AAAADEQBNMQBOMgBPAgMAARkAEAIDAAEZABADEQBUMQBVMgBWAAAAAxEAVDEAVTIAVgAAAxEAWzEAXDIAXQAAAAMRAFsxAFwyAF0AAAADEQBjMQBkMgBlAAAAAxEAYzEAZDIAZQIZABAaAAECGQAQGgABAxEAajEAazIAbAAAAAMRAGoxAGsyAGwDBgAECAAGCQAFAwYABAgABgkABQURAHExAHQyAHVzAHJ0AHMAAAAAAAURAHExAHQyAHVzAHJ0AHMCCAAGDQAJAggABg0ACQMRAHoxAHsyAHwAAAADEQB6MQB7MgB8AQMAAQEDAAEDEQCBATEAggEyAIMBAAAAAxEAgQExAIIBMgCDAQIGAAQNAAkCBgAEDQAJAxEAiAExAIkBMgCKAQAAAAMRAIgBMQCJATIAigEBAwABAQMAAQURAI8BMQCSATIAkwFzAJABdACRAQAAAAAABREAjwExAJIBMgCTAXMAkAF0AJEBHwIBIEkBIUwBIk0BI04BJVABJlIUJ1MVKFUBKVcUKlgWLVkBLloBL1sUM14XNF8bNWACNmECN2ICOGMCOWQCOmYCO2gUPGkcPWsCPm0UP24dQG8CQXACQnEUQ3QeRHUiRXYDRncDR3gDSHkDSXoDSnwDS34UTH8jTYEBA06DARRPhAEkUIUBA1GGAQNShwEUU4oBJVSLASlVjQEqVo4BKleRASpYkgEqWZMBKlqVASpblwEUXJgBK12aASpenAEUX50BLGCeASphnwEqYqABFGOjAS1kpAExZaUBDWamAQ1npwENaKgBDWmpAQ1qqwENa60BFGyuATJtsAENbrIBFG-zATNwtAENcbUBDXK2ARR1uQE0droBOne7AQV4vAEFeb0BBXq-AQV7vwEFfMEBBX3DARR-xAE7f8YBBYAByAEUgQHJATyCAcoBBYMBywEFhAHMARSFAc8BPYYB0AFBhwHRAQmIAdIBCYkB0wEJigHUAQmLAdUBCYwB1wEJjQHZARSOAdoBQo8B3QEJkAHfARSRAeABQ5IB4gEJkwHjAQmUAeQBFJUB5wFElgHoAUiXAeoBSZgB6wFJmQHuAUmaAe8BSZsB8AFJnAHyAUmdAfQBFJ4B9QFKnwH3AUmgAfkBFKEB-gFLogH7AUmjAfwBSaQB_QEUpQGAAkymAYECUKcBggIPqAGDAg-pAYQCD6oBhQIPqwGGAg-sAYgCD60BigIUrgGLAlGvAY0CD7ABjwIUsQGQAlKyAZECD7MBkgIPtAGTAhS1AZYCU7YBlwJXtwGZAhC4AZoCELkBnQIQugGeAhC7AZ8CELwBoQIQvQGjAhS-AaQCWL8BpgIQwAGoAhTBAakCWcIBqgIQwwGrAhDEAawCFMUBrwJaxgGwAl7HAbICX8gBswJfyQG2Al_KAbcCX8sBuAJfzAG6Al_NAbwCFM4BvQJgzwG_Al_QAcECFNEBwgJh0gHDAl_TAcQCX9QBxQIU1QHIAmLWAckCZtcBygIR2AHLAhHZAcwCEdoBzQIR2wHOAhHcAdACEd0B0gIU3gHTAmffAdUCEeAB1wIU4QHYAmjiAdkCEeMB2gIR5AHbAhTlAd4CaeYB3wJt5wHgAgfoAeECB-kB4gIH6gHjAgfrAeQCB-wB5gIH7QHoAhTuAekCbu8B6wIH8AHtAhTxAe4Cb_IB7wIH8wHwAgf0AfECFPUB9AJw9gH1Anb3AfYCCPgB9wII-QH4Agj6AfkCCPsB-gII_AH8Agj9Af4CFP4B_wJ3_wGBAwiAAoMDFIEChAN4ggKFAwiDAoYDCIQChwMUhQKKA3mGAosDfYcCjQMGiAKOAwaJApADBooCkQMGiwKSAwaMApQDBo0ClgMUjgKXA36PApkDBpACmwMUkQKcA3-SAp0DBpMCngMGlAKfAxSVAqIDgAGWAqMDhAGXAqQDCpgCpQMKmQKmAwqaAqcDCpsCqAMKnAKqAwqdAqwDFJ4CrQOFAZ8CrwMKoAKxAxShArIDhgGiArMDCqMCtAMKpAK1AxSlArgDhwGmArkDiwGnArsDBKgCvAMEqQK-AwSqAr8DBKsCwAMErALCAwStAsQDFK4CxQOMAa8CxwMEsALJAxSxAsoDjQGyAssDBLMCzAMEtALNAxS1AtADjgG2AtEDlAE"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Status = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED"
};
var DayOfWeek = {
  SUNDAY: "SUNDAY",
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY"
};
var BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  DECLINED: "DECLINED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
var envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.string().default("5000"),
  BETTER_AUTH_SECRET: z.string().min(10),
  BETTER_AUTH_URL: z.string().url(),
  APP_EMAIL: z.string().email(),
  APP_PASS: z.string().min(1),
  APP_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),
  ADMIN1_USER_EMAIL: z.string().email(),
  ADMIN1_USER_PASSWORD: z.string().min(6)
});
var env = envSchema.parse(process.env);

// src/lib/prisma.ts
var connectionString = `${env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var APP_URL = env.APP_URL;
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: env.APP_EMAIL,
    pass: env.APP_PASS
  }
});
var emailVerificationTemplate = (user, verificationUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f7fb;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
      background-color: #f5f7fb;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .header {
      padding: 28px 30px;
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: #ffffff;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 20px;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 36px 32px;
      color: #111827;
      line-height: 1.7;
      font-size: 15px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }

    .button {
      display: inline-block;
      padding: 14px 22px;
      background: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
    }

    .button:hover {
      background: #4338ca;
    }

    .link-box {
      background: #f3f4f6;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      word-break: break-all;
      color: #374151;
    }

    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      background: #fafafa;
    }

    .muted {
      color: #6b7280;
      font-size: 13px;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <h1>SkillBridge</h1>
      </div>

      <div class="content">

        <div class="title">
          Verify your email address
        </div>

        <p>Hi ${user.name || "there"},</p>

        <p>
          Thanks for joining <strong>SkillBridge</strong>.
          To complete your registration and activate your account,
          please verify your email address.
        </p>

        <div class="button-wrapper">
          <a href="${verificationUrl}" class="button">
            Verify Email
          </a>
        </div>

        <p class="muted">
          If the button doesn\u2019t work, copy and paste this link into your browser:
        </p>

        <div class="link-box">
          ${verificationUrl}
        </div>

        <p style="margin-top: 24px;">
          If you didn\u2019t create an account, you can safely ignore this email.
        </p>

        <p style="margin-top: 24px;">
          \u2014 Team SkillBridge
        </p>

      </div>

      <div class="footer">
        \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} SkillBridge. All rights reserved.
      </div>

    </div>
  </div>
</body>
</html>
`;
var resetPasswordTemplate = (user, resetUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your password</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f7fb;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
      background-color: #f5f7fb;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .header {
      padding: 28px 30px;
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: #ffffff;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 20px;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 36px 32px;
      color: #111827;
      line-height: 1.7;
      font-size: 15px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }

    .button {
      display: inline-block;
      padding: 14px 22px;
      background: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
    }

    .button:hover {
      background: #4338ca;
    }

    .link-box {
      background: #f3f4f6;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      word-break: break-all;
      color: #374151;
    }

    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      background: #fafafa;
    }

    .muted {
      color: #6b7280;
      font-size: 13px;
    }

    .warning {
      margin-top: 24px;
      padding: 14px;
      border-radius: 8px;
      background: #fef3c7;
      color: #92400e;
      font-size: 13px;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <h1>SkillBridge</h1>
      </div>

      <div class="content">

        <div class="title">
          Reset your password
        </div>

        <p>Hi ${user.name || "there"},</p>

        <p>
          We received a request to reset the password for your
          <strong>SkillBridge</strong> account.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <div class="button-wrapper">
          <a href="${resetUrl}" class="button">
            Reset Password
          </a>
        </div>

        <p class="muted">
          If the button doesn\u2019t work, copy and paste this link into your browser:
        </p>

        <div class="link-box">
          ${resetUrl}
        </div>

        <div class="warning">
          For security reasons, this link will expire after a limited time.
          If you didn't request a password reset, you can safely ignore this email.
          Your password will remain unchanged.
        </div>

        <p style="margin-top: 24px;">
          Stay secure,<br />
          Team SkillBridge
        </p>

      </div>

      <div class="footer">
        \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} SkillBridge. All rights reserved.
      </div>

    </div>
  </div>
</body>
</html>
`;
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [APP_URL],
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    // user stay logged in for 30 days
    updateAge: 60 * 60 * 24
    // refresh every day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE"
      },
      profileCompleted: {
        type: "boolean",
        required: false,
        defaultValue: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const resetUrl = new URL(url);
      resetUrl.searchParams.set("callbackURL", `${APP_URL}/reset-password`);
      await transporter.sendMail({
        from: '"SkillBridge Team" <skillbridge@sk.com>',
        to: user.email,
        subject: "Reset your SkillBridge password",
        html: resetPasswordTemplate(user, resetUrl.toString())
      });
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    //sends email only when user registers/signup
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        console.log("******************* email sent");
        console.log({ user, url, token });
        const verificationUrl = new URL(url);
        verificationUrl.searchParams.set(
          "callbackURL",
          `${APP_URL}/onboarding`
          // `${APP_URL}/verify-email`
        );
        const info = await transporter.sendMail({
          from: '"Skill Bridge Team" <skillbridge@sk.com>',
          // sender address
          to: user.email,
          // list of recipients
          subject: "Please verify your email!",
          // subject line
          html: emailVerificationTemplate(user, verificationUrl.toString())
          // HTML body
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      } catch (err) {
        console.error("Error while sending mail:", err);
        throw err;
      }
    }
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      //  for refresh token
      prompt: "select_account consent",
      // show the select google account prompt 
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar"
      ]
    }
  },
  account: {
    accountLinking: {
      disableImplicitLinking: true
    }
  }
});

// src/app.ts
var import_cors = __toESM(require_lib());

// src/modules/tutors/tutor.routes.ts
import express from "express";

// src/constants/userRoles.ts
var USER_ROLES = {
  ADMIN: "ADMIN",
  TUTOR: "TUTOR",
  STUDENT: "STUDENT"
};

// src/utils/convertStrToNum.utils.ts
var convertStrToNum = (value, fieldName) => {
  if (value === void 0) return void 0;
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Invalid ${fieldName}`);
  }
  return num;
};

// src/helpers/paginationSorting.helper.ts
var paginationSorting = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return { page, limit, skip, sortBy, sortOrder };
};
var paginationSorting_helper_default = paginationSorting;

// src/modules/tutors/tutor.types.ts
var dayMap = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY"
};

// src/helpers/generateTimeSlots.ts
var generateTimeSlots = (start, end, duration, date) => {
  const slots = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  let current = new Date(date);
  current.setUTCHours(startH, startM, 0, 0);
  const endTime = new Date(date);
  endTime.setUTCHours(endH, endM, 0, 0);
  while (current < endTime) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current);
    slotEnd.setMinutes(slotEnd.getMinutes() + duration);
    if (slotEnd <= endTime) {
      slots.push({
        start: new Date(slotStart),
        end: new Date(slotEnd)
      });
    }
    current.setMinutes(current.getMinutes() + duration);
  }
  return slots;
};

// src/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
};

// src/constants/availabilityStatus.ts
var AVAILABILITY_STATUS = {
  AVAILABLE: "AVAILABLE",
  PARTIAL: "PARTIAL",
  FULL: "FULL",
  UNAVAILABLE: "UNAVAILABLE"
};

// src/modules/tutors/tutor.service.ts
var getAllTutorProfiles = async (query) => {
  console.log("REQ QUERY:", query);
  const minRating = convertStrToNum(query.minRating, "minRating");
  const minPrice = convertStrToNum(query.minPrice, "minPrice");
  const maxPrice = convertStrToNum(query.maxPrice, "maxPrice");
  const subjectId = query.course?.trim();
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const searchTerm = query.searchTerm?.trim();
  const allowedSortFields = ["avgRating", "hourlyRate", "createdAt"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const whereCondition = {
    user: {
      status: "ACTIVE",
      role: USER_ROLES.TUTOR
    },
    ...query.isFeatured !== void 0 && {
      isFeatured: query.isFeatured === "true"
    },
    ...subjectId && {
      categories: {
        some: {
          categoryId: subjectId
        }
      }
    },
    ...minPrice !== void 0 || maxPrice !== void 0 ? {
      hourlyRate: {
        ...minPrice !== void 0 && { gte: minPrice },
        ...maxPrice !== void 0 && { lte: maxPrice }
      }
    } : {},
    ...searchTerm && {
      OR: [
        // 1. Search by tutor name (NEW)
        {
          user: {
            name: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        },
        // 2. Search by category / subject
        {
          categories: {
            some: {
              category: {
                name: {
                  contains: searchTerm,
                  mode: "insensitive"
                }
              }
            }
          }
        },
        // 3. Search by parent category
        {
          categories: {
            some: {
              category: {
                parent: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive"
                  }
                }
              }
            }
          }
        }
      ]
    },
    ...minRating !== void 0 && {
      avgRating: {
        gte: minRating
      }
    }
  };
  const [tutors, total] = await Promise.all([
    prisma.tutorProfile.findMany({
      where: whereCondition,
      include: {
        user: true,
        availability: true,
        bookingsAsTutor: true,
        tutorReviews: true,
        categories: {
          include: {
            category: {
              include: {
                parent: true
              }
            }
          }
        },
        _count: true
      },
      take: limit,
      skip,
      orderBy: {
        [safeSortBy]: sortOrder
      }
    }),
    prisma.tutorProfile.count({
      where: whereCondition
    })
  ]);
  const formattedTutors = tutors.map((tutor) => ({
    ...tutor,
    categories: tutor.categories.map((c) => c.category)
  }));
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: formattedTutors
  };
};
var getMyStudents = async (userId, query) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      userId
    },
    select: {
      id: true
    }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor profile not found");
  }
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const searchTerm = query.searchTerm?.trim();
  const whereCondition = {
    tutorId: tutor.id,
    ...searchTerm && {
      student: {
        user: {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      }
    }
  };
  const bookings = await prisma.booking.findMany({
    where: whereCondition,
    include: {
      student: {
        include: {
          user: true
        }
      },
      review: true
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const studentMap = /* @__PURE__ */ new Map();
  for (const booking of bookings) {
    const studentId = booking.student.id;
    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        id: booking.student.id,
        user: booking.student.user,
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        latestBooking: booking.createdAt,
        hasReviewed: false
      });
    }
    const student = studentMap.get(studentId);
    student.totalBookings++;
    if (booking.status === "COMPLETED") {
      student.completedBookings++;
    }
    if (booking.status === "CANCELLED") {
      student.cancelledBookings++;
    }
    if (booking.review) {
      student.hasReviewed = true;
    }
    if (booking.createdAt > student.latestBooking) {
      student.latestBooking = booking.createdAt;
    }
  }
  const students = [...studentMap.values()];
  students.sort(
    (a, b) => sortOrder === "asc" ? a.latestBooking.getTime() - b.latestBooking.getTime() : b.latestBooking.getTime() - a.latestBooking.getTime()
  );
  const total = students.length;
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: students.slice(skip, skip + limit)
  };
};
var getMyTutorProfile = async (userId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      bookingsAsTutor: true,
      tutorReviews: true,
      availability: true,
      categories: {
        include: {
          category: {
            include: {
              parent: true
            }
          }
        }
      }
    }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor not found");
  }
  const formattedTutorsData = {
    ...tutor,
    categories: tutor?.categories.map((c) => c.category)
  };
  return formattedTutorsData;
};
var getTutorProfileById = async (tutorId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: {
      user: true,
      bookingsAsTutor: true,
      tutorReviews: true,
      availability: true,
      categories: {
        include: {
          category: {
            include: {
              parent: true
            }
          }
        }
      }
    }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor not found");
  }
  const formattedTutorsData = {
    ...tutor,
    categories: tutor?.categories.map((c) => c.category)
  };
  return formattedTutorsData;
};
var getAvailableDates = async (tutorId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
      user: {
        status: "ACTIVE",
        role: USER_ROLES.TUTOR
      }
    }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor not found");
  }
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() + 2);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);
  endDate.setHours(23, 59, 59, 999);
  const availabilities = await prisma.availability.findMany({
    where: { tutorId, isActive: true }
  });
  if (!availabilities.length) {
    return {
      tutorId,
      dates: []
    };
  }
  const bookings = await prisma.booking.findMany({
    where: {
      tutorId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      startTime: true
    }
  });
  const bookingMap = /* @__PURE__ */ new Map();
  for (const b of bookings) {
    const dateKey = b.startTime.toLocaleDateString("en-CA");
    if (!bookingMap.has(dateKey)) {
      bookingMap.set(dateKey, /* @__PURE__ */ new Set());
    }
    bookingMap.get(dateKey).add(b.startTime.getTime());
  }
  const availableDays = /* @__PURE__ */ new Map();
  for (const a of availabilities) {
    if (!availableDays.has(a.dayOfWeek)) {
      availableDays.set(a.dayOfWeek, []);
    }
    availableDays.get(a.dayOfWeek).push(a);
  }
  const results = [];
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24));
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    date.setHours(0, 0, 0, 0);
    const dayName = dayMap[date.getDay()];
    const dateKey = date.toLocaleDateString("en-CA");
    const dayAvailabilities = availableDays.get(dayName);
    if (!dayAvailabilities) {
      results.push({
        date: dateKey,
        status: AVAILABILITY_STATUS.UNAVAILABLE,
        availableSlots: 0
      });
      continue;
    }
    let totalSlots = 0;
    let bookedSlots = 0;
    const bookedSet = bookingMap.get(dateKey) ?? /* @__PURE__ */ new Set();
    for (const avail of dayAvailabilities) {
      const slots = generateTimeSlots(
        avail.startTime,
        avail.endTime,
        avail.slotDuration,
        new Date(dateKey)
        // date
      );
      totalSlots += slots.length;
      for (const slot of slots) {
        if (bookedSet.has(slot.start.getTime())) {
          bookedSlots++;
        }
      }
    }
    const availableSlots = totalSlots - bookedSlots;
    let status;
    if (totalSlots === 0) {
      status = AVAILABILITY_STATUS.UNAVAILABLE;
    } else if (availableSlots === 0) {
      status = AVAILABILITY_STATUS.FULL;
    } else if (availableSlots === totalSlots) {
      status = AVAILABILITY_STATUS.AVAILABLE;
    } else {
      status = AVAILABILITY_STATUS.PARTIAL;
    }
    results.push({
      date: dateKey,
      status,
      availableSlots
    });
  }
  return {
    tutorId,
    range: {
      from: startDate.toLocaleDateString("en-CA"),
      to: endDate.toLocaleDateString("en-CA")
      // from: startDate.toISOString().split("T")[0],
      // to: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
      //     .toISOString()
      //     .split("T")[0],
    },
    dates: results
  };
};
var getAvailableSlotsForDate = async (tutorId, date) => {
  if (!date || typeof date !== "string") {
    throw new AppError(400, "Date query is required");
  }
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
      user: {
        status: "ACTIVE",
        role: USER_ROLES.TUTOR
      }
    }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor not found");
  }
  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) {
    throw new AppError(400, "Invalid date format. Use YYYY-MM-DD");
  }
  const dayOfWeek = targetDate.getDay();
  const dayName = dayMap[dayOfWeek];
  const availability = await prisma.availability.findMany({
    where: {
      tutorId,
      dayOfWeek: dayName,
      isActive: true
    }
  });
  if (!availability.length) return [];
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  const bookings = await prisma.booking.findMany({
    where: {
      tutorId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
      },
      startTime: {
        gte: start,
        lte: end
      }
    },
    select: {
      startTime: true
    }
  });
  const bookedSet = new Set(
    bookings.map((b) => b.startTime.getTime())
  );
  let allSlots = [];
  for (const avail of availability) {
    const slots = generateTimeSlots(
      avail.startTime,
      avail.endTime,
      avail.slotDuration,
      targetDate
    );
    for (const slot of slots) {
      const slotTime = slot.start.getTime();
      if (!bookedSet.has(slotTime)) {
        allSlots.push(slot);
      }
    }
  }
  return {
    tutorId,
    date,
    totalSlots: allSlots.length,
    slots: allSlots
  };
};
var createTutorProfile = async (payload, userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.role !== USER_ROLES.TUTOR && user.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Only tutors or admin can create tutor profile");
  }
  const existingProfile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (existingProfile) {
    throw new AppError(409, "Tutor profile already exists");
  }
  const result = await prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfile.create({
      data: {
        bio: payload.bio ?? null,
        education: payload.education.toUpperCase(),
        experience: payload.experience,
        hourlyRate: payload.hourlyRate,
        // isFeatured: payload.isFeatured ?? false,
        user: {
          connect: { id: userId }
        }
      }
    });
    if (payload.categories?.length) {
      const uniqueCategoryIds = [...new Set(payload.categories)];
      const categories = await tx.categories.findMany({
        where: {
          id: { in: uniqueCategoryIds },
          parentId: { not: null }
        },
        select: { id: true }
      });
      if (categories.length !== uniqueCategoryIds.length) {
        throw new AppError(400, "Invalid category selection. Only subcategories are allowed.");
      }
      await tx.tutorCategory.createMany({
        data: uniqueCategoryIds.map((categoryId) => ({
          tutorId: tutorProfile.id,
          categoryId
        })),
        skipDuplicates: true
      });
      await tx.user.update({
        where: { id: userId },
        data: {
          profileCompleted: true
        }
      });
    }
    return tutorProfile;
  });
  return result;
};
var updateTutorProfile = async (payload, tutorId, userId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor not found");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isOwner = tutor?.userId === userId;
  if (!isAdmin && !isOwner) {
    throw new AppError(403, "You are not authorized!");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updateData = Object.fromEntries(
      Object.entries({
        bio: payload.bio,
        education: payload.education?.toUpperCase(),
        experience: payload.experience,
        hourlyRate: payload.hourlyRate
        // isFeatured: payload.isFeatured,
      }).filter(([_, value]) => value !== void 0)
    );
    const updatedTutor = await tx.tutorProfile.update({
      where: { id: tutorId },
      data: updateData
    });
    if (payload.categories) {
      const uniqueCategoryIds = [...new Set(payload.categories)];
      const categories = await tx.categories.findMany({
        where: { id: { in: uniqueCategoryIds } },
        select: { id: true }
      });
      if (categories.length !== uniqueCategoryIds.length) {
        throw new AppError(400, "One or more category IDs are invalid");
      }
      await tx.tutorCategory.deleteMany({
        where: { tutorId }
      });
      await tx.tutorCategory.createMany({
        data: uniqueCategoryIds.map((categoryId) => ({
          tutorId,
          categoryId
        })),
        skipDuplicates: true
      });
    }
    return updatedTutor;
  });
  return result;
};
var deleteTutorProfile = async (tutorId, userId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor not found");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isOwner = tutor?.userId === userId;
  if (!isAdmin && !isOwner) {
    throw new AppError(403, "You are not authorized!");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.tutorCategory.deleteMany({
      where: { tutorId }
    });
    await tx.availability.deleteMany({
      where: { tutorId }
    });
    return await tx.tutorProfile.delete({
      where: { id: tutorId }
    });
  });
  return result;
};
var TutorService = {
  getAllTutorProfiles,
  getMyStudents,
  getMyTutorProfile,
  getTutorProfileById,
  getAvailableDates,
  getAvailableSlotsForDate,
  createTutorProfile,
  updateTutorProfile,
  deleteTutorProfile
};

// src/modules/tutors/tutor.controller.ts
var getAllTutorProfiles2 = async (req, res, next) => {
  try {
    const queryParams = req.query;
    const tutors = await TutorService.getAllTutorProfiles(queryParams);
    res.status(200).json({
      success: true,
      message: "Tutors fetched successfully",
      data: tutors
    });
  } catch (error) {
    next(error);
  }
};
var getMyStudents2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const students = await TutorService.getMyStudents(
      userId,
      req.query
    );
    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students
    });
  } catch (error) {
    next(error);
  }
};
var getMyTutorProfile2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const tutor = await TutorService.getMyTutorProfile(userId);
    res.status(200).json({
      success: true,
      message: "Tutor Profile fetched successfully",
      data: tutor
    });
  } catch (error) {
    next(error);
  }
};
var getTutorProfileById2 = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const tutor = await TutorService.getTutorProfileById(tutorId);
    res.status(200).json({
      success: true,
      message: "Tutor fetched successfully",
      data: tutor
    });
  } catch (error) {
    next(error);
  }
};
var getAvailableDates2 = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const tutor = await TutorService.getAvailableDates(tutorId);
    res.status(200).json({
      success: true,
      message: "Available dates are fetched successfully",
      data: tutor
    });
  } catch (error) {
    next(error);
  }
};
var getAvailableSlotsForDate2 = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const { date } = req.query;
    const tutor = await TutorService.getAvailableSlotsForDate(tutorId, date);
    res.status(200).json({
      success: true,
      message: "Available slots are fetched successfully",
      data: tutor
    });
  } catch (error) {
    next(error);
  }
};
var createTutorProfile2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await TutorService.createTutorProfile(req.body, userId);
    res.status(201).json({
      success: true,
      message: "Tutor profile created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateTutorProfile2 = async (req, res, next) => {
  try {
    const tutorId = req.params?.tutorId;
    const userId = req.user?.id;
    const result = await TutorService.updateTutorProfile(req.body, tutorId, userId);
    res.status(200).json({
      success: true,
      message: "Tutor updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteTutorProfile2 = async (req, res, next) => {
  try {
    const tutorId = req.params?.tutorId;
    const userId = req.user?.id;
    const result = await TutorService.deleteTutorProfile(tutorId, userId);
    res.status(200).json({
      success: true,
      message: "Tutor deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var TutorController = {
  getAllTutorProfiles: getAllTutorProfiles2,
  getMyStudents: getMyStudents2,
  getMyTutorProfile: getMyTutorProfile2,
  getTutorProfileById: getTutorProfileById2,
  getAvailableDates: getAvailableDates2,
  getAvailableSlotsForDate: getAvailableSlotsForDate2,
  createTutorProfile: createTutorProfile2,
  updateTutorProfile: updateTutorProfile2,
  deleteTutorProfile: deleteTutorProfile2
};

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    console.log("auth middleware!!!!");
    console.log("Req headers", req.headers);
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        throw new AppError(401, "You are not authorized!");
      }
      if (!session.user.emailVerified) {
        throw new AppError(403, "Please verify your email to proceed!");
      }
      console.log(session);
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image,
        role: session.user.role,
        status: session.user.status,
        profileCompleted: session.user.profileCompleted
      };
      if (roles.length && !roles.includes(req.user.role)) {
        throw new AppError(
          403,
          "You don't have permission to access this resource!"
        );
      }
      if (req.user.status === Status.BLOCKED) {
        throw new AppError(
          403,
          "Your account is BLOCKED. Contact admin."
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
var auth_default = auth2;

// src/modules/tutors/tutor.routes.ts
var router = express.Router();
router.get("/", TutorController.getAllTutorProfiles);
router.get("/me", auth_default(USER_ROLES.TUTOR), TutorController.getMyTutorProfile);
router.get("/my-students", auth_default(USER_ROLES.TUTOR), TutorController.getMyStudents);
router.get("/:tutorId", TutorController.getTutorProfileById);
router.get("/:tutorId/available-dates", auth_default(USER_ROLES.ADMIN, USER_ROLES.STUDENT, USER_ROLES.TUTOR), TutorController.getAvailableDates);
router.get("/:tutorId/available-dates/slots", auth_default(USER_ROLES.ADMIN, USER_ROLES.STUDENT, USER_ROLES.TUTOR), TutorController.getAvailableSlotsForDate);
router.post("/", auth_default(USER_ROLES.TUTOR), TutorController.createTutorProfile);
router.patch("/:tutorId", auth_default(USER_ROLES.ADMIN, USER_ROLES.TUTOR), TutorController.updateTutorProfile);
router.delete("/:tutorId", auth_default(USER_ROLES.ADMIN, USER_ROLES.TUTOR), TutorController.deleteTutorProfile);
var TutorRoutes = router;

// src/modules/category/category.routes.ts
import { Router as Router2 } from "express";

// src/modules/category/category.service.ts
var getAllCategories = async (query) => {
  const {
    search,
    parentOnly,
    childOnly,
    hasTutors,
    hasStudents,
    withNoStudent,
    withNoTutor
  } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  if (parentOnly === "true" && childOnly === "true") {
    throw new AppError(
      400,
      "parentOnly and childOnly cannot both be true"
    );
  }
  const whereCondition = {
    ...search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          children: {
            some: {
              name: {
                contains: search,
                mode: "insensitive"
              }
            }
          }
        }
      ]
    },
    ...parentOnly === "true" && {
      parentId: null
    },
    ...childOnly === "true" && {
      parentId: {
        not: null
      }
    },
    ...hasTutors === "true" && {
      tutors: {
        some: {}
      }
    },
    ...hasStudents === "true" && {
      students: {
        some: {}
      }
    },
    ...withNoStudent === "true" && {
      students: {
        none: {}
      }
    },
    ...withNoTutor === "true" && {
      tutors: {
        none: {}
      }
    }
  };
  const [categories, total] = await Promise.all([
    prisma.categories.findMany({
      where: whereCondition,
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            tutors: true,
            students: true,
            children: true
          }
        }
      },
      // PAGINATION ADDED
      skip,
      take: limit,
      // optional sorting (you already have sortBy/sortOrder)
      orderBy: {
        [sortBy || "name"]: sortOrder || "asc"
      }
    }),
    prisma.categories.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: categories
  };
};
var getCategoryById = async (categoryId, query) => {
  const {
    search,
    hasTutors,
    hasStudents,
    withNoStudent,
    withNoTutor
  } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const childWhereCondition = {
    parentId: categoryId,
    ...search && {
      name: {
        contains: search,
        mode: "insensitive"
      }
    },
    ...hasTutors === "true" && {
      tutors: {
        some: {}
      }
    },
    ...hasStudents === "true" && {
      students: {
        some: {}
      }
    },
    ...withNoStudent === "true" && {
      students: {
        none: {}
      }
    },
    ...withNoTutor === "true" && {
      tutors: {
        none: {}
      }
    }
  };
  const existing = await prisma.categories.findUnique({
    where: {
      id: categoryId
    },
    include: {
      parent: true,
      tutors: {
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      },
      students: {
        include: {
          student: true
        }
      },
      _count: {
        select: {
          tutors: true,
          students: true,
          children: true
        }
      }
    }
  });
  if (!existing) {
    throw new AppError(404, "CategoryId not found!");
  }
  const [children, totalChildren] = await Promise.all([
    prisma.categories.findMany({
      where: childWhereCondition,
      include: {
        tutors: true,
        students: true,
        _count: {
          select: {
            tutors: true,
            students: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy || "name"]: sortOrder || "asc"
      }
    }),
    prisma.categories.count({
      where: childWhereCondition
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total: totalChildren,
      totalPages: Math.ceil(totalChildren / limit)
    },
    data: {
      ...existing,
      children
    }
  };
};
var createCategory = async (payload, userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new AppError(404, "User not found");
    }
    if (user.role !== USER_ROLES.ADMIN) {
      throw new AppError(403, "Only admin can create categories");
    }
    if (!payload.name || typeof payload.name !== "string") {
      throw new AppError(400, "Category name is required");
    }
    const name = payload.name.trim().toUpperCase();
    if (payload.parentId) {
      const parent = await prisma.categories.findUnique({
        where: { id: payload.parentId }
      });
      if (!parent) {
        throw new AppError(404, "Parent category not found");
      }
    }
    const existing = await prisma.categories.findFirst({
      where: {
        name,
        parentId: payload.parentId ?? null
      }
    });
    if (existing) {
      throw new AppError(
        409,
        "Category already exists under this parent"
      );
    }
    const category = await prisma.categories.create({
      data: {
        name,
        shortDesc: payload.shortDesc?.trim() || null,
        description: payload.description?.trim() || null,
        thumbnail: payload.thumbnail?.trim() || null,
        learningOutcomes: payload.learningOutcomes?.filter(Boolean) ?? [],
        isFeatured: payload.isFeatured ?? true,
        parentId: payload.parentId || null
      }
    });
    return category;
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Category already exists");
    }
    throw error;
  }
};
var updateCategory = async (payload, userId, categoryId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Only admin can update categories");
  }
  if (payload.parentId && payload.parentId === categoryId) {
    throw new AppError(400, "A category cannot be its own parent");
  }
  let name;
  if (payload.name) {
    name = payload.name.trim().toUpperCase();
    const nameConflict = await prisma.categories.findFirst({
      where: {
        name,
        id: {
          not: categoryId
        }
      }
    });
    if (nameConflict) {
      throw new AppError(
        409,
        "A category with this name already exists"
      );
    }
  }
  if (payload.parentId !== null && payload.parentId !== void 0) {
    const parent = await prisma.categories.findUnique({
      where: { id: payload.parentId }
    });
    if (!parent) {
      throw new AppError(404, "Parent category not found");
    }
  }
  const existing = await prisma.categories.findFirst({
    where: { id: categoryId }
  });
  if (!existing) {
    throw new AppError(404, "Category not found");
  }
  const category = await prisma.categories.update({
    where: {
      id: categoryId
    },
    data: {
      ...name && { name },
      ...payload.shortDesc !== void 0 && {
        shortDesc: payload.shortDesc
      },
      ...payload.description !== void 0 && {
        description: payload.description
      },
      ...payload.thumbnail !== void 0 && {
        thumbnail: payload.thumbnail
      },
      ...payload.learningOutcomes !== void 0 && {
        learningOutcomes: payload.learningOutcomes
      },
      ...payload.isFeatured !== void 0 && {
        isFeatured: payload.isFeatured
      },
      ...payload.parentId !== void 0 && {
        parentId: payload.parentId
      }
    }
  });
  return category;
};
var deleteCategory = async (userId, categoryId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Only admin can delete categories");
  }
  const existing = await prisma.categories.findFirst({
    where: { id: categoryId }
  });
  if (!existing) {
    throw new AppError(404, "CategoryId not found!");
  }
  const category = await prisma.categories.delete({
    where: { id: categoryId }
  });
  return category;
};
var CategoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var getAllCategories2 = async (req, res, next) => {
  try {
    const query = req.query;
    const categories = await CategoryService.getAllCategories(query);
    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
var getCategoryById2 = async (req, res, next) => {
  try {
    const query = req.query;
    const categoryId = req.params?.categoryId;
    const categories = await CategoryService.getCategoryById(categoryId, query);
    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
var createCategory2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const category = await CategoryService.createCategory(req.body, userId);
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    next(error);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const categoryId = req.params?.categoryId;
    const category = await CategoryService.updateCategory(req.body, userId, categoryId);
    return res.status(201).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const categoryId = req.params?.categoryId;
    const category = await CategoryService.deleteCategory(userId, categoryId);
    return res.status(201).json({
      success: true,
      message: "Category deleted successfully",
      data: category
    });
  } catch (error) {
    next(error);
  }
};
var CategoryController = {
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.routes.ts
var router2 = Router2();
router2.get("/", CategoryController.getAllCategories);
router2.get("/:categoryId", CategoryController.getCategoryById);
router2.post("/", auth_default(USER_ROLES.ADMIN), CategoryController.createCategory);
router2.patch("/:categoryId", auth_default(USER_ROLES.ADMIN), CategoryController.updateCategory);
router2.delete("/:categoryId", auth_default(USER_ROLES.ADMIN), CategoryController.deleteCategory);
var CategoryRoutes = router2;

// src/modules/review/review.routes.ts
import { Router as Router3 } from "express";

// src/modules/review/review.service.ts
var createReview = async (userId, data) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new AppError(404, "User not found");
    }
    const studentWithBooking = await tx.studentProfile.findUnique({
      where: { userId },
      include: {
        bookingsAsStudent: {
          where: {
            id: data.bookingId,
            status: "COMPLETED"
          },
          include: {
            review: true,
            // Check if review exists in the same query
            tutor: true
            // Get tutor stats in the same query
          }
        }
      }
    });
    if (!studentWithBooking) throw new AppError(404, "Student profile not found");
    const booking = studentWithBooking.bookingsAsStudent[0];
    if (!booking) throw new AppError(404, "No completed booking found with this ID.");
    if (booking.review) throw new AppError(409, "You have already reviewed this booking.");
    const tutor = booking.tutor;
    if (!tutor) throw new AppError(404, "Tutor not found.");
    const review = await tx.review.create({
      data: {
        tutorId: booking.tutorId,
        studentId: studentWithBooking.id,
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment ?? null
      }
    });
    const newTotal = tutor.totalReviews + 1;
    const newAvg = (tutor.avgRating * tutor.totalReviews + data.rating) / newTotal;
    await tx.tutorProfile.update({
      where: { id: booking.tutorId },
      data: {
        totalReviews: newTotal,
        avgRating: newAvg
      }
    });
    return review;
  });
};
var updateReview = async (reviewId, userId, data) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new AppError(404, "User not found!");
    }
    const reviewData = await tx.review.findUnique({
      where: { id: reviewId },
      include: {
        student: true,
        // To verify ownership via userId
        tutor: {
          // To get current avgRating and totalReviews
          select: { id: true, avgRating: true, totalReviews: true }
        }
      }
    });
    if (!reviewData) throw new AppError(404, "Review not found!");
    if (!reviewData.student) throw new AppError(404, "Student not found!");
    if (reviewData.student.userId !== userId) {
      throw new AppError(403, "Unauthorized! Only the author can update this review.");
    }
    if (!reviewData.tutor) throw new AppError(404, "Tutor not found!");
    const oldRating = reviewData.rating;
    const newRating = data.rating ?? oldRating;
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: {
        rating: newRating,
        comment: data.comment ?? reviewData.comment
      }
    });
    if (data.rating !== void 0 && data.rating !== oldRating) {
      const tutor = reviewData.tutor;
      const updatedTotalScore = tutor.avgRating * tutor.totalReviews - oldRating + newRating;
      const newAvg = updatedTotalScore / tutor.totalReviews;
      await tx.tutorProfile.update({
        where: { id: tutor.id },
        data: {
          avgRating: parseFloat(newAvg.toFixed(2))
        }
      });
    }
    return updatedReview;
  });
};
var getReviewByTutorId = async (tutorId, query) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const allowedSortFields = ["createdAt", "rating"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const minRating = query.minRating ? Number(query.minRating) : void 0;
  const whereCondition = {
    tutorId,
    ...minRating !== void 0 && {
      rating: {
        gte: minRating
      }
    }
  };
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: whereCondition,
      include: {
        student: {
          select: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        tutor: {
          select: {
            education: true,
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        booking: {
          select: {
            category: {
              select: {
                name: true
              }
            }
          }
        }
      },
      take: limit,
      skip,
      orderBy: {
        [safeSortBy]: sortOrder
      }
    }),
    prisma.review.count({
      where: whereCondition
    })
  ]);
  if (!reviews.length) {
    const tutorExists = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      select: { id: true }
    });
    if (!tutorExists) {
      throw new AppError(404, "Tutor doesn't exist");
    }
  }
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: reviews
  };
};
var getMyReviews = async (userId, role, query) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const allowedSortFields = ["createdAt", "rating"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const minRating = query.minRating ? Number(query.minRating) : void 0;
  let whereCondition = {};
  if (role === USER_ROLES.STUDENT) {
    const student = await prisma.studentProfile.findUnique({
      where: {
        userId
      },
      select: {
        id: true
      }
    });
    if (!student) {
      throw new AppError(404, "Student profile not found");
    }
    whereCondition.studentId = student.id;
  }
  if (role === USER_ROLES.TUTOR) {
    const tutor = await prisma.tutorProfile.findUnique({
      where: {
        userId
      },
      select: {
        id: true
      }
    });
    if (!tutor) {
      throw new AppError(404, "Tutor profile not found");
    }
    whereCondition.tutorId = tutor.id;
  }
  if (minRating !== void 0) {
    whereCondition.rating = {
      gte: minRating
    };
  }
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: whereCondition,
      include: {
        tutor: {
          select: {
            education: true,
            avgRating: true,
            totalReviews: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        student: {
          select: {
            education: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        booking: {
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        [safeSortBy]: sortOrder
      }
    }),
    prisma.review.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: reviews
  };
};
var getAllReviews = async (query) => {
  const {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  } = paginationSorting_helper_default(query);
  const allowedSortFields = [
    "createdAt",
    "rating"
  ];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const minRating = query.minRating ? Number(query.minRating) : void 0;
  const searchTerm = query.searchTerm?.trim();
  const where = {
    ...minRating && {
      rating: {
        gte: minRating
      }
    },
    ...searchTerm && {
      OR: [
        {
          student: {
            user: {
              name: {
                contains: searchTerm,
                mode: "insensitive"
              }
            }
          }
        },
        {
          tutor: {
            user: {
              name: {
                contains: searchTerm,
                mode: "insensitive"
              }
            }
          }
        },
        {
          booking: {
            category: {
              name: {
                contains: searchTerm,
                mode: "insensitive"
              }
            }
          }
        }
      ]
    }
  };
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        student: {
          include: {
            user: true
          }
        },
        tutor: {
          include: {
            user: true
          }
        },
        booking: {
          include: {
            category: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        [safeSortBy]: sortOrder
      }
    }),
    prisma.review.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      )
    },
    data: reviews
  };
};
var deleteReview = async (reviewId, user) => {
  return await prisma.$transaction(async (tx) => {
    if (user.role !== USER_ROLES.STUDENT && user.role !== USER_ROLES.ADMIN) {
      throw new AppError(403, "Unauthorized!");
    }
    const review = await tx.review.findUnique({
      where: { id: reviewId },
      include: { tutor: true }
    });
    if (!review) throw new AppError(404, "Review doesn't exist!");
    if (!review.tutor) throw new AppError(404, "Tutor doesn't exist!");
    if (user.role === USER_ROLES.STUDENT) {
      const student = await tx.studentProfile.findUnique({
        where: { userId: user.id }
      });
      if (!student) throw new AppError(404, "Student profile not found!");
      if (review.studentId !== student.id) {
        throw new AppError(403, "Unauthorized! You can only delete your own reviews.");
      }
    }
    const tutor = review.tutor;
    const newTotal = Math.max(0, tutor.totalReviews - 1);
    let newAvg = 0;
    if (newTotal > 0) {
      const updatedTotalScore = tutor.avgRating * tutor.totalReviews - review.rating;
      newAvg = parseFloat((updatedTotalScore / newTotal).toFixed(2));
    }
    await tx.tutorProfile.update({
      where: { id: review.tutorId },
      data: {
        totalReviews: newTotal,
        avgRating: newAvg
      }
    });
    return tx.review.delete({
      where: { id: reviewId }
    });
  });
};
var reviewService = {
  createReview,
  updateReview,
  getReviewByTutorId,
  getMyReviews,
  getAllReviews,
  deleteReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { bookingId, rating, comment } = req.body;
    const review = await reviewService.createReview(userId, { bookingId, rating, comment });
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review
    });
  } catch (error) {
    next(error);
  }
};
var updateReview2 = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;
    const review = await reviewService.updateReview(reviewId, userId, req.body);
    res.status(201).json({
      success: true,
      message: "Review updated successfully",
      data: review
    });
  } catch (error) {
    next(error);
  }
};
var getReviewByTutorId2 = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const query = req.query;
    const result = await reviewService.getReviewByTutorId(tutorId, query);
    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyReviews2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const result = await reviewService.getMyReviews(
      userId,
      role,
      req.query
    );
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllReviews2 = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews(req.query);
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteReview2 = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const user = req.user;
    const result = await reviewService.deleteReview(reviewId, user);
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview: createReview2,
  updateReview: updateReview2,
  getReviewByTutorId: getReviewByTutorId2,
  getMyReviews: getMyReviews2,
  getAllReviews: getAllReviews2,
  deleteReview: deleteReview2
};

// src/modules/review/review.routes.ts
var router3 = Router3();
router3.get("/", auth_default(USER_ROLES.ADMIN), reviewController.getAllReviews);
router3.get("/my-reviews", auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR), reviewController.getMyReviews);
router3.get("/:tutorId", auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR, USER_ROLES.ADMIN), reviewController.getReviewByTutorId);
router3.post("/", auth_default(USER_ROLES.STUDENT), reviewController.createReview);
router3.patch("/:reviewId", auth_default(USER_ROLES.STUDENT), reviewController.updateReview);
router3.delete("/:reviewId", auth_default(USER_ROLES.STUDENT, USER_ROLES.ADMIN), reviewController.deleteReview);
var ReviewRoutes = router3;

// src/modules/students/student.routes.ts
import express2 from "express";

// src/modules/students/student.service.ts
var getAllStudentProfiles = async (query) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const searchTerm = query.searchTerm?.trim();
  const allowedSortFields = ["createdAt"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const whereCondition = {
    user: {
      status: "ACTIVE",
      role: USER_ROLES.STUDENT
    },
    // Optional search (by name/email/category)
    ...searchTerm && {
      OR: [
        {
          user: {
            name: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        },
        {
          user: {
            email: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        },
        {
          categories: {
            some: {
              OR: [
                {
                  category: {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive"
                    }
                  }
                },
                {
                  category: {
                    parent: {
                      name: {
                        contains: searchTerm,
                        mode: "insensitive"
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
  };
  const [students, total] = await Promise.all([
    prisma.studentProfile.findMany({
      where: whereCondition,
      include: {
        user: true,
        bookingsAsStudent: true,
        studentReviews: true,
        categories: {
          include: {
            category: {
              include: {
                parent: true
              }
            }
          }
        },
        _count: true
      },
      take: limit,
      skip,
      orderBy: {
        [safeSortBy]: sortOrder
      }
    }),
    prisma.studentProfile.count({
      where: whereCondition
    })
  ]);
  const formattedStudents = students.map((student) => ({
    ...student,
    categories: student.categories.map((c) => c.category)
  }));
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: formattedStudents
  };
};
var getMyStudentProfile = async (userId) => {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      bookingsAsStudent: true,
      studentReviews: true,
      categories: {
        include: {
          category: {
            include: {
              parent: true
            }
          }
        }
      }
    }
  });
  if (!student) {
    throw new AppError(404, "Student not found");
  }
  const formattedStudentData = {
    ...student,
    categories: student?.categories.map((c) => c.category)
  };
  return formattedStudentData;
};
var getStudentProfileById = async (studentId) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      bookingsAsStudent: true,
      studentReviews: true,
      categories: {
        include: {
          category: {
            include: {
              parent: true
            }
          }
        }
      }
    }
  });
  if (!student) {
    throw new AppError(404, "Student not found");
  }
  const formattedStudentData = {
    ...student,
    categories: student?.categories.map((c) => c.category)
  };
  return formattedStudentData;
};
var createStudentProfile = async (payload, userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.role !== USER_ROLES.STUDENT) {
    throw new AppError(403, "Only students can create student profiles");
  }
  const existingProfile = await prisma.studentProfile.findUnique({
    where: { userId }
  });
  if (existingProfile) {
    throw new AppError(409, "Student profile already exists");
  }
  const result = await prisma.$transaction(async (tx) => {
    const studentProfile = await tx.studentProfile.create({
      data: {
        bio: payload.bio ?? null,
        education: payload.education ?? null,
        user: {
          connect: { id: userId }
        }
      }
    });
    if (payload.categories?.length) {
      const uniqueCategoryIds = [...new Set(payload.categories)];
      const categories = await tx.categories.findMany({
        where: {
          id: { in: uniqueCategoryIds },
          parentId: { not: null }
        },
        select: { id: true }
      });
      if (categories.length !== uniqueCategoryIds.length) {
        throw new AppError(400, "One or more category IDs are invalid. Only subcategories are allowed.");
      }
      await tx.studentCategory.createMany({
        data: uniqueCategoryIds.map((categoryId) => ({
          studentId: studentProfile.id,
          categoryId
        })),
        skipDuplicates: true
      });
    }
    await tx.user.update({
      where: { id: userId },
      data: {
        profileCompleted: true
      }
    });
    return tx.studentProfile.findUnique({
      where: {
        id: studentProfile.id
      },
      include: {
        categories: {
          select: {
            category: true
          }
        }
      }
    });
    ;
  });
  return result;
};
var updateStudentProfile = async (payload, studentId, userId) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId }
  });
  if (!student) {
    throw new AppError(404, "Student not found");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isOwner = student?.userId === userId;
  if (!isAdmin && !isOwner) {
    throw new AppError(403, "You are not authorized! Only Admin or the Owner can update profile");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updateData = Object.fromEntries(
      Object.entries({
        bio: payload.bio,
        education: payload.education
      }).filter(([_, value]) => value !== void 0)
    );
    const updatedStudent = await tx.studentProfile.update({
      where: { id: studentId },
      data: updateData
    });
    if (payload.categories) {
      const uniqueCategoryIds = [...new Set(payload.categories)];
      const categories = await tx.categories.findMany({
        where: {
          id: { in: uniqueCategoryIds },
          parentId: { not: null }
        },
        select: { id: true }
      });
      if (categories.length !== uniqueCategoryIds.length) {
        throw new AppError(400, "One or more category IDs are invalid");
      }
      await tx.studentCategory.deleteMany({
        where: { studentId }
      });
      await tx.studentCategory.createMany({
        data: uniqueCategoryIds.map((categoryId) => ({
          studentId,
          categoryId
        })),
        skipDuplicates: true
      });
    }
    return updatedStudent;
  });
  return result;
};
var deleteStudentProfile = async (studentId, userId) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId }
  });
  if (!student) {
    throw new AppError(404, "Student not found");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isOwner = student?.userId === userId;
  if (!isAdmin && !isOwner) {
    throw new AppError(403, "You are not authorized! Only Admin or the Owner can delete profile");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.studentCategory.deleteMany({
      where: { studentId }
    });
    return await tx.studentProfile.delete({
      where: { id: studentId }
    });
  });
  return result;
};
var StudentService = {
  getAllStudentProfiles,
  getMyStudentProfile,
  getStudentProfileById,
  createStudentProfile,
  updateStudentProfile,
  deleteStudentProfile
};

// src/modules/students/student.controller.ts
var getAllStudentProfiles2 = async (req, res, next) => {
  try {
    const query = req.query;
    const students = await StudentService.getAllStudentProfiles(query);
    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students
    });
  } catch (error) {
    next(error);
  }
};
var getMyStudentProfile2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const student = await StudentService.getMyStudentProfile(userId);
    res.status(200).json({
      success: true,
      message: "Student Profile fetched successfully",
      data: student
    });
  } catch (error) {
    next(error);
  }
};
var getStudentProfileById2 = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await StudentService.getStudentProfileById(studentId);
    res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student
    });
  } catch (error) {
    next(error);
  }
};
var createStudentProfile2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await StudentService.createStudentProfile(req.body, userId);
    res.status(201).json({
      success: true,
      message: "Student profile created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateStudentProfile2 = async (req, res, next) => {
  try {
    const studentId = req.params?.studentId;
    const userId = req.user?.id;
    const result = await StudentService.updateStudentProfile(req.body, studentId, userId);
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteStudentProfile2 = async (req, res, next) => {
  try {
    const studentId = req.params?.studentId;
    const userId = req.user?.id;
    const result = await StudentService.deleteStudentProfile(studentId, userId);
    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var StudentController = {
  getAllStudentProfiles: getAllStudentProfiles2,
  getMyStudentProfile: getMyStudentProfile2,
  getStudentProfileById: getStudentProfileById2,
  createStudentProfile: createStudentProfile2,
  updateStudentProfile: updateStudentProfile2,
  deleteStudentProfile: deleteStudentProfile2
};

// src/modules/students/student.routes.ts
var router4 = express2.Router();
router4.get("/", auth_default(USER_ROLES.ADMIN), StudentController.getAllStudentProfiles);
router4.get("/me", auth_default(USER_ROLES.STUDENT), StudentController.getMyStudentProfile);
router4.get("/:studentId", auth_default(USER_ROLES.ADMIN, USER_ROLES.STUDENT), StudentController.getStudentProfileById);
router4.post("/", auth_default(USER_ROLES.STUDENT), StudentController.createStudentProfile);
router4.patch("/:studentId", auth_default(USER_ROLES.ADMIN, USER_ROLES.STUDENT), StudentController.updateStudentProfile);
router4.delete("/:studentId", auth_default(USER_ROLES.ADMIN, USER_ROLES.STUDENT), StudentController.deleteStudentProfile);
var StudentRoutes = router4;

// src/modules/availability/availability.routes.ts
import express3 from "express";

// src/utils/normalizeTime.utils.ts
var convert12hTo24hFormat = (time) => {
  const match = time.trim().match(
    /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i
  );
  if (!match || !match[1] || !match[2] || !match[3]) {
    throw new Error("Invalid 12-hour format");
  }
  let hours = match[1];
  let minutes = match[2];
  let period = match[3];
  let h = parseInt(hours, 10);
  if (period.toUpperCase() === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return `${String(h).padStart(2, "0")}:${minutes}`;
};
var normalizeTime = (time) => {
  const trimmed = time.trim();
  if (/AM|PM/i.test(trimmed)) {
    return convert12hTo24hFormat(trimmed);
  }
  return trimmed;
};

// src/utils/timeToMinutes.ts
var timeToMinutes = (time) => {
  const parts = time.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid time format. Expected HH:mm");
  }
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error("Invalid time value");
  }
  return hours * 60 + minutes;
};

// src/modules/availability/availability.service.ts
var isValidTime = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};
var isValidSlot = (time) => {
  const [h, m] = time.split(":").map(Number);
  return m === 0 || m === 30;
};
var getMyAvailability = async (userId) => {
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor profile not found");
  }
  return prisma.availability.findMany({
    where: { tutorId: tutor.id },
    orderBy: [
      { dayOfWeek: "asc" },
      { startTime: "asc" }
    ]
  });
};
var getAllAvailabilities = async (query) => {
  const { tutorId, dayOfWeek } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const allowedSortFields = ["createdAt", "startTime"];
  const safeSortBy = sortBy && allowedSortFields.includes(sortBy) ? sortBy : null;
  const where = {};
  if (tutorId) {
    const tutorExists = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      select: { id: true }
    });
    if (!tutorExists) {
      throw new AppError(404, "Tutor not found");
    }
    where.tutorId = tutorId;
  }
  if (dayOfWeek !== void 0) {
    const isValidDay = Object.values(DayOfWeek).includes(
      dayOfWeek
    );
    if (!isValidDay) {
      throw new AppError(400, "Invalid dayOfWeek value");
    }
    where.dayOfWeek = dayOfWeek;
  }
  const [availabilities, total] = await Promise.all([
    prisma.availability.findMany({
      where,
      take: limit,
      skip,
      orderBy: safeSortBy ? { [safeSortBy]: sortOrder || "asc" } : [
        { dayOfWeek: "asc" },
        { startTime: "asc" }
      ]
    }),
    prisma.availability.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: availabilities
  };
};
var createAvailability = async (payload, userId) => {
  const { dayOfWeek, startTime: sTime, endTime: eTime, slotDuration } = payload;
  if (!Object.values(DayOfWeek).includes(dayOfWeek)) {
    throw new AppError(400, "Invalid dayOfWeek value");
  }
  if (!isValidSlot(sTime) || !isValidSlot(eTime)) {
    throw new AppError(400, "Time must be in 30-minute intervals");
  }
  const duration = slotDuration ?? 30;
  const SLOT_BASE = 30;
  if (duration <= 0 || duration % SLOT_BASE !== 0) {
    throw new AppError(400, "slotDuration must be a positive multiple of 30 minutes");
  }
  const startTime = normalizeTime(sTime);
  const endTime = normalizeTime(eTime);
  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    throw new AppError(400, "Invalid time format");
  }
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const diffMinutes = endMinutes - startMinutes;
  if (diffMinutes <= 0) {
    throw new AppError(400, "Start time must be before end time");
  }
  if (diffMinutes % duration !== 0) {
    throw new AppError(
      400,
      "Availability duration must be divisible by slotDuration"
    );
  }
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: {
      id: true
    }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor not found!");
  }
  const existing = await prisma.availability.findFirst({
    where: {
      tutorId: tutor.id,
      dayOfWeek,
      AND: [
        {
          startTime: { lt: endTime }
        },
        {
          endTime: { gt: startTime }
        }
      ]
    }
  });
  if (existing) {
    throw new AppError(409, "Overlapping availability exists");
  }
  return prisma.availability.create({
    data: {
      tutorId: tutor.id,
      dayOfWeek,
      startTime,
      endTime,
      slotDuration: duration
      // or from payload later
    }
  });
};
var updateAvailability = async (userId, availabilityId, payload) => {
  const existing = await prisma.availability.findUnique({
    where: { id: availabilityId }
  });
  if (!existing) {
    throw new AppError(404, "Availability not found");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (user?.role !== USER_ROLES.TUTOR && user?.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Unauthorized!");
  }
  if (user?.role === USER_ROLES.TUTOR) {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { userId }
    });
    if (tutor?.id !== existing.tutorId) {
      throw new AppError(403, "Unauthorized! Only the owner can edit!");
    }
  }
  const dayOfWeek = payload.dayOfWeek ?? existing.dayOfWeek;
  if (!Object.values(DayOfWeek).includes(dayOfWeek)) {
    throw new AppError(400, "Invalid dayOfWeek value");
  }
  const duration = payload.slotDuration ?? existing.slotDuration;
  const SLOT_BASE = 30;
  if (duration <= 0 || duration % SLOT_BASE !== 0) {
    throw new AppError(400, "slotDuration must be a positive multiple of 30 minutes");
  }
  const startTime = payload.startTime ? normalizeTime(payload.startTime) : existing.startTime;
  const endTime = payload.endTime ? normalizeTime(payload.endTime) : existing.endTime;
  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    throw new AppError(400, "Invalid time format. Use HH:mm");
  }
  if (!isValidSlot(startTime) || !isValidSlot(endTime)) {
    throw new AppError(400, "Time must be in 30-minute intervals");
  }
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const diffMinutes = endMinutes - startMinutes;
  if (diffMinutes <= 0) {
    throw new AppError(400, "Start time must be before end time");
  }
  if (diffMinutes % duration !== 0) {
    throw new AppError(400, "Availability duration must be divisible by slotDuration");
  }
  const overlap = await prisma.availability.findFirst({
    where: {
      tutorId: existing.tutorId,
      dayOfWeek,
      id: { not: availabilityId },
      AND: [
        {
          startTime: { lt: endTime }
        },
        {
          endTime: { gt: startTime }
        }
      ]
    }
  });
  if (overlap) {
    throw new AppError(409, "Overlapping availability exists");
  }
  return prisma.availability.update({
    where: { id: availabilityId },
    data: {
      dayOfWeek,
      startTime,
      endTime,
      slotDuration: duration
    }
  });
};
var deleteAvailability = async (availabilityId, userId) => {
  const existing = await prisma.availability.findUnique({
    where: { id: availabilityId }
  });
  if (!existing) {
    throw new AppError(404, "Availability not found");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (user?.role !== USER_ROLES.TUTOR && user?.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Unauthorized!");
  }
  if (user?.role === USER_ROLES.TUTOR) {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { userId }
    });
    if (tutor?.id !== existing.tutorId) {
      throw new AppError(403, "Unauthorized! Only the owner can delete!");
    }
  }
  return prisma.availability.delete({
    where: { id: availabilityId }
  });
};
var AvailabilityService = {
  getMyAvailability,
  getAllAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability
};

// src/modules/availability/availability.controller.ts
var getMyAvailability2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await AvailabilityService.getMyAvailability(userId);
    res.status(200).json({
      success: true,
      message: "Availability fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllAvailabilities2 = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await AvailabilityService.getAllAvailabilities(query);
    res.status(200).json({
      success: true,
      message: "Availability fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createAvailability2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await AvailabilityService.createAvailability(req.body, userId);
    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateAvailability2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { availabilityId } = req.params;
    if (!availabilityId) {
      throw new AppError(400, "availabilityId is required");
    }
    const result = await AvailabilityService.updateAvailability(userId, availabilityId, req.body);
    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteAvailability2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { availabilityId } = req.params;
    if (!availabilityId) {
      throw new AppError(400, "availabilityId is required");
    }
    const result = await AvailabilityService.deleteAvailability(availabilityId, userId);
    res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var AvailabilityController = {
  getMyAvailability: getMyAvailability2,
  getAllAvailabilities: getAllAvailabilities2,
  createAvailability: createAvailability2,
  updateAvailability: updateAvailability2,
  deleteAvailability: deleteAvailability2
};

// src/modules/availability/availability.routes.ts
var router5 = express3.Router();
router5.get("/me", auth_default(USER_ROLES.TUTOR), AvailabilityController.getMyAvailability);
router5.get("/all", auth_default(USER_ROLES.ADMIN), AvailabilityController.getAllAvailabilities);
router5.post("/", auth_default(USER_ROLES.TUTOR), AvailabilityController.createAvailability);
router5.patch("/:availabilityId", auth_default(USER_ROLES.TUTOR, USER_ROLES.ADMIN), AvailabilityController.updateAvailability);
router5.delete("/:availabilityId", auth_default(USER_ROLES.TUTOR, USER_ROLES.ADMIN), AvailabilityController.deleteAvailability);
var AvailabilityRoutes = router5;

// src/modules/booking/booking.routes.ts
import { Router as Router6 } from "express";

// src/constants/sessionStatus.ts
var SESSION_STATUS = {
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  MISSED: "MISSED",
  CANCELLED: "CANCELLED"
};

// src/modules/google/google.calendar.service.ts
import { google as google2 } from "googleapis";

// src/modules/google/google.client.ts
import { google } from "googleapis";
var createGoogleClient = () => {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  );
};

// src/modules/google/google.auth.service.ts
var getAuthenticatedClient = async (userId) => {
  const googleAccount = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "google"
    }
  });
  console.log("ggl;", googleAccount?.scope);
  if (!googleAccount) {
    throw new Error("Google not connected");
  }
  const client = createGoogleClient();
  client.setCredentials({
    access_token: googleAccount.accessToken,
    refresh_token: googleAccount.refreshToken
  });
  console.log({
    providerId: googleAccount.providerId,
    scope: googleAccount.scope
  });
  return client;
};

// src/modules/google/google.calendar.service.ts
var createMeetLink = async (booking, userId) => {
  const authClient = await getAuthenticatedClient(userId);
  const calendar = google2.calendar({
    version: "v3",
    auth: authClient
  });
  const event = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: "Tutoring Session",
      start: {
        dateTime: booking.startTime.toISOString()
      },
      end: {
        dateTime: booking.endTime.toISOString()
      },
      conferenceData: {
        createRequest: {
          requestId: booking.id,
          conferenceSolutionKey: {
            type: "hangoutsMeet"
          }
        }
      }
    }
  });
  const meetLink = event.data.conferenceData?.entryPoints?.[0]?.uri;
  return meetLink;
};

// src/modules/booking/booking.service.ts
var toValidDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime()) ? date : null;
};
var createBooking = async (userId, payload) => {
  const date = toValidDate(payload.date);
  const startTime = new Date(payload.startTime);
  const endTime = new Date(payload.endTime);
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new AppError(400, "Invalid time");
  }
  if (!date || !startTime || !endTime) {
    throw new AppError(400, "Invalid date or time provided");
  }
  if (startTime >= endTime) {
    throw new AppError(400, "Start time must be before end time");
  }
  const [user, tutor, student, category] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    }),
    prisma.tutorProfile.findUnique({
      where: { id: payload.tutorId },
      select: { id: true }
    }),
    prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true }
    }),
    prisma.categories.findUnique({
      where: { id: payload.categoryId },
      select: { id: true }
    })
  ]);
  if (!user) throw new AppError(404, "User not found!");
  if (user.role !== USER_ROLES.STUDENT) {
    throw new AppError(401, "Unauthorized! Only students can create bookings.");
  }
  if (!tutor) throw new AppError(404, "Tutor not found!");
  if (!student) throw new AppError(404, "Student not found!");
  if (!category) throw new AppError(404, "Category not found!");
  const overlap = await prisma.booking.findFirst({
    where: {
      tutorId: payload.tutorId,
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
      },
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime }
        }
      ]
    }
  });
  if (overlap) {
    throw new AppError(409, "This time slot is already booked");
  }
  if (payload.startTime <= /* @__PURE__ */ new Date()) {
    throw new AppError(400, "Cannot book past time slots");
  }
  const bookings = await prisma.booking.create({
    data: {
      tutorId: payload.tutorId,
      studentId: student.id,
      categoryId: payload.categoryId,
      date: payload.startTime,
      startTime: payload.startTime,
      endTime: payload.endTime
    }
  });
  return bookings;
};
var getAllBookings = async (role, query) => {
  if (role !== USER_ROLES.ADMIN) {
    throw new AppError(401, "Unauthorized! Only admin can access this resource.");
  }
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const allowedSortFields = ["createdAt", "date", "status"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const searchTerm = query.searchTerm?.trim();
  const status = query.status && Object.values(BookingStatus).includes(query.status) ? query.status : void 0;
  const whereCondition = {
    // Filter by booking status
    ...status && { status },
    // Filter by tutor
    ...query.tutorId && {
      tutorId: query.tutorId
    },
    // Filter by student
    ...query.studentId && {
      studentId: query.studentId
    },
    // Date range filter
    ...query.startDate || query.endDate ? {
      date: {
        ...query.startDate && {
          gte: /* @__PURE__ */ new Date(`${query.startDate}T00:00:00.000Z`)
        },
        ...query.endDate && {
          lte: /* @__PURE__ */ new Date(`${query.endDate}T23:59:59.999Z`)
        }
      }
    } : {},
    // Search by tutor/student name
    ...searchTerm && {
      OR: [
        {
          tutor: {
            user: {
              name: {
                contains: searchTerm,
                mode: "insensitive"
              }
            }
          }
        },
        {
          student: {
            user: {
              name: {
                contains: searchTerm,
                mode: "insensitive"
              }
            }
          }
        }
      ]
    }
  };
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: whereCondition,
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        },
        review: true
      },
      take: limit,
      skip,
      orderBy: {
        [safeSortBy]: sortOrder
      }
    }),
    prisma.booking.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: bookings
  };
};
var getMyBookings = async (userId, query) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true }
  });
  if (!user) throw new AppError(404, "User not found!");
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const allowedSortFields = [
    "createdAt",
    "date",
    "status",
    "startTime",
    "endTime",
    "meetingType"
  ];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const status = query.status && Object.values(BookingStatus).includes(query.status) ? query.status : void 0;
  const meetingType = query.meetingType;
  const sessionStatus = query.sessionStatus?.toUpperCase();
  const now = /* @__PURE__ */ new Date();
  let whereCondition = {};
  if (user.role === USER_ROLES.STUDENT) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!student) throw new AppError(404, "Student not found");
    whereCondition.studentId = student.id;
  }
  if (user.role === USER_ROLES.TUTOR) {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!tutor) throw new AppError(404, "Tutor not found");
    whereCondition.tutorId = tutor.id;
  }
  if (status) {
    whereCondition.status = status;
  }
  if (meetingType) {
    whereCondition.meetingType = meetingType;
  }
  if (sessionStatus) {
    switch (sessionStatus) {
      case SESSION_STATUS.UPCOMING:
        whereCondition.status = BookingStatus.CONFIRMED;
        whereCondition.startTime = {
          gt: now
        };
        break;
      case SESSION_STATUS.ONGOING:
        whereCondition.status = BookingStatus.CONFIRMED;
        whereCondition.startTime = {
          lte: now
        };
        whereCondition.endTime = {
          gte: now
        };
        break;
      case SESSION_STATUS.COMPLETED:
        whereCondition.status = BookingStatus.COMPLETED;
        break;
      case SESSION_STATUS.MISSED:
        whereCondition.status = BookingStatus.CONFIRMED;
        whereCondition.endTime = {
          lt: now
        };
        break;
      case SESSION_STATUS.CANCELLED:
        whereCondition.status = BookingStatus.CANCELLED;
        break;
    }
  }
  if (query.startDate || query.endDate) {
    whereCondition.date = {
      ...query.startDate && {
        gte: /* @__PURE__ */ new Date(`${query.startDate}T00:00:00.000Z`)
      },
      ...query.endDate && {
        lte: /* @__PURE__ */ new Date(`${query.endDate}T23:59:59.999Z`)
      }
    };
  }
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: whereCondition,
      include: {
        tutor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        },
        review: true
      },
      take: limit,
      skip,
      orderBy: {
        [safeSortBy]: sortOrder
      }
    }),
    prisma.booking.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: bookings
  };
};
var getBookingByBookingId = async (bookingId) => {
  if (!bookingId) {
    throw new AppError(400, "Booking ID is required");
  }
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: true,
      student: true,
      category: {
        select: {
          id: true,
          name: true
        }
      },
      review: true
    }
  });
  if (!booking) throw new AppError(404, "Booking not found");
  return booking;
};
var updateBookingStatus = async (userId, bookingId, status) => {
  const allowedStatuses = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.COMPLETED,
    BookingStatus.DECLINED,
    BookingStatus.CANCELLED
  ];
  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      400,
      `Invalid status! Allowed: ${allowedStatuses.join(", ")}`
    );
  }
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    if (!user) throw new AppError(401, "User not found");
    const booking = await tx.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new AppError(404, "Booking not found");
    if (booking.status === status) {
      throw new AppError(409, `Booking already ${status}`);
    }
    const validTransitions = {
      PENDING: [
        BookingStatus.CONFIRMED,
        BookingStatus.DECLINED,
        BookingStatus.CANCELLED
      ],
      CONFIRMED: [
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED
      ],
      COMPLETED: [],
      CANCELLED: [],
      DECLINED: []
    };
    if (!validTransitions[booking.status]?.includes(status)) {
      throw new AppError(
        400,
        `Invalid transition ${booking.status} \u2192 ${status}`
      );
    }
    if (user.role === USER_ROLES.STUDENT) {
      const student = await tx.studentProfile.findUnique({
        where: { userId }
      });
      if (!student) throw new AppError(404, "Student profile not found");
      if (student.id !== booking.studentId) {
        throw new AppError(403, "You can only modify your own bookings");
      }
      if (status !== BookingStatus.CANCELLED) {
        throw new AppError(403, "Students can only cancel bookings");
      }
    } else if (user.role === USER_ROLES.TUTOR) {
      const tutor = await tx.tutorProfile.findUnique({
        where: { userId }
      });
      if (!tutor) throw new AppError(404, "Tutor profile not found");
      if (tutor.id !== booking.tutorId) {
        throw new AppError(403, "You can only modify your own bookings");
      }
      const tutorAllowed = [
        BookingStatus.CONFIRMED,
        BookingStatus.COMPLETED,
        BookingStatus.DECLINED
      ];
      if (!tutorAllowed.includes(status)) {
        throw new AppError(403, "Invalid action for tutor");
      }
    } else if (user.role === USER_ROLES.ADMIN) {
    } else {
      throw new AppError(403, "Unauthorized role");
    }
    let meetingLink = booking.meetingLink;
    let meetingType = booking.meetingType;
    if (status === BookingStatus.CONFIRMED && !meetingLink) {
      meetingLink = await createMeetLink(booking, userId) ?? null;
      meetingType = "GOOGLE_MEET";
    }
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status,
        meetingLink,
        meetingType: meetingType ?? null
      }
    });
    return updatedBooking;
  });
};
var BookingService = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingByBookingId,
  updateBookingStatus
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await BookingService.createBooking(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllBookings2 = async (req, res, next) => {
  try {
    const userRole = req.user?.role;
    const query = req.query;
    const result = await BookingService.getAllBookings(userRole, query);
    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyBookings2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const query = req.query;
    const result = await BookingService.getMyBookings(userId, query);
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getBookingByBookingId2 = async (req, res, next) => {
  try {
    const result = await BookingService.getBookingByBookingId(req.params?.bookingId);
    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateBookingStatus2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const bookingId = req.params?.bookingId;
    const status = req.body.status;
    if (!bookingId) {
      throw new AppError(400, "Booking ID is required");
    }
    if (!status) {
      throw new AppError(400, "Status is required");
    }
    const result = await BookingService.updateBookingStatus(
      userId,
      bookingId,
      status
    );
    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var BookingController = {
  createBooking: createBooking2,
  getAllBookings: getAllBookings2,
  getMyBookings: getMyBookings2,
  getBookingByBookingId: getBookingByBookingId2,
  updateBookingStatus: updateBookingStatus2
};

// src/modules/booking/booking.routes.ts
var router6 = Router6();
router6.get("/all", auth_default(USER_ROLES.ADMIN), BookingController.getAllBookings);
router6.get("/me", auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR), BookingController.getMyBookings);
router6.get("/:bookingId", auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR, USER_ROLES.ADMIN), BookingController.getBookingByBookingId);
router6.post("/", auth_default(USER_ROLES.STUDENT), BookingController.createBooking);
router6.patch("/:bookingId/status", auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR, USER_ROLES.ADMIN), BookingController.updateBookingStatus);
var BookingRoutes = router6;

// src/modules/admin/admin.routes.ts
import { Router as Router7 } from "express";

// src/constants/reportTypes.ts
var REPORT_TYPES = [
  "overview",
  "users",
  "bookings",
  "reviews",
  "categories",
  "contacts"
];

// src/modules/admin/admin.service.ts
var getAllUsers = async (adminId, query) => {
  const allowedRoles = Object.values(USER_ROLES);
  const allowedStatuses = [Status.ACTIVE, Status.BLOCKED];
  if (query.role && !allowedRoles.includes(query.role)) {
    throw new AppError(
      400,
      `Invalid role! Allowed: ${allowedRoles.join(", ")}`
    );
  }
  if (query.status && !allowedStatuses.includes(query.status)) {
    throw new AppError(
      400,
      `Invalid status! Allowed: ${allowedStatuses.join(", ")}`
    );
  }
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true }
  });
  if (!admin) {
    throw new AppError(401, "Admin user not found");
  }
  if (admin.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Unauthorized access");
  }
  const { page, limit, skip, sortBy, sortOrder } = paginationSorting_helper_default(query);
  const searchTerm = query.searchTerm?.trim();
  const isFeatured = query.isFeatured === void 0 ? void 0 : query.isFeatured === "true";
  const whereCondition = {
    ...query.role && {
      role: query.role
    },
    ...query.status && {
      status: query.status
    },
    ...isFeatured !== void 0 && {
      tutorProfile: {
        is: {
          isFeatured
        }
      }
    },
    ...searchTerm && {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      ]
    }
  };
  let orderBy = {
    createdAt: sortOrder
  };
  switch (sortBy) {
    case "name":
      orderBy = {
        name: sortOrder
      };
      break;
    case "email":
      orderBy = {
        email: sortOrder
      };
      break;
    case "avgRating":
      orderBy = {
        tutorProfile: {
          avgRating: sortOrder
        }
      };
      break;
    case "hourlyRate":
      orderBy = {
        tutorProfile: {
          hourlyRate: sortOrder
        }
      };
      break;
    case "createdAt":
    default:
      orderBy = {
        createdAt: sortOrder
      };
  }
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        status: true,
        profileCompleted: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        tutorProfile: {
          include: {
            categories: {
              select: {
                category: true
              }
            }
          }
        }
      }
    }),
    prisma.user.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: users
  };
};
var getPlatformAnalytics = async () => {
  const now = /* @__PURE__ */ new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const startOf7Days = new Date(now);
  startOf7Days.setDate(now.getDate() - 7);
  const startOf30Days = new Date(now);
  startOf30Days.setDate(now.getDate() - 30);
  const [
    totalUsers,
    activeTutors,
    activeStudents,
    completedTutorProfiles,
    completedStudentProfiles,
    featuredTutors,
    totalCategories,
    parentCategories,
    childCategories,
    assignedTutors,
    reviewStats,
    totalMessages,
    bookingsToday,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    // revenueToday,
    // revenueLast7Days,
    last30DaysUsers,
    last30DaysTutors,
    last30DaysStudents,
    last7DaysBookings,
    bookingStatusStats
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { role: USER_ROLES.TUTOR, status: Status.ACTIVE }
    }),
    prisma.user.count({
      where: { role: USER_ROLES.STUDENT, status: Status.ACTIVE }
    }),
    prisma.user.count({
      where: {
        role: USER_ROLES.TUTOR,
        status: Status.ACTIVE,
        profileCompleted: true
      }
    }),
    prisma.user.count({
      where: {
        role: USER_ROLES.STUDENT,
        status: Status.ACTIVE,
        profileCompleted: true
      }
    }),
    prisma.tutorProfile.count({
      where: {
        isFeatured: true
      }
    }),
    prisma.categories.count(),
    prisma.categories.count({
      where: {
        parentId: null
      }
    }),
    prisma.categories.count({
      where: {
        parentId: {
          not: null
        }
      }
    }),
    prisma.tutorCategory.count(),
    prisma.review.aggregate({
      _count: {
        id: true
      },
      _avg: {
        rating: true
      }
    }),
    // Contact messages
    prisma.contactMessage.count(),
    prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    }),
    prisma.booking.count(),
    prisma.booking.count({
      where: {
        status: BookingStatus.PENDING
      }
    }),
    prisma.booking.count({
      where: {
        status: BookingStatus.CONFIRMED
      }
    }),
    prisma.booking.count({
      where: { status: BookingStatus.COMPLETED }
    }),
    prisma.booking.count({
      where: { status: BookingStatus.CANCELLED }
    }),
    // prisma.booking.aggregate({
    //     where: {
    //         status: BookingStatus.COMPLETED,
    //         createdAt: {
    //             gte: startOfToday,
    //             lte: endOfToday,
    //         },
    //     },
    //     _sum: { price: true },
    // }),
    // prisma.booking.aggregate({
    //     where: {
    //         status: BookingStatus.COMPLETED,
    //         createdAt: {
    //             gte: startOf7Days,
    //         },
    //     },
    //     _sum: { price: true },
    // }),
    prisma.user.count({
      where: {
        createdAt: { gte: startOf30Days }
      }
    }),
    prisma.user.count({
      where: {
        role: USER_ROLES.TUTOR,
        createdAt: {
          gte: startOf30Days
        }
      }
    }),
    prisma.user.count({
      where: {
        role: USER_ROLES.STUDENT,
        createdAt: {
          gte: startOf30Days
        }
      }
    }),
    prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as total
      FROM "Booking"
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC;
    `,
    prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true }
    })
  ]);
  const cancellationRate = totalBookings > 0 ? cancelledBookings / totalBookings * 100 : 0;
  const completionRate = totalBookings > 0 ? completedBookings / totalBookings * 100 : 0;
  const averageBookingsPerDay = last7DaysBookings.length > 0 ? last7DaysBookings.reduce((sum, d) => sum + d.total, 0) / 7 : 0;
  return {
    overview: {
      totalUsers,
      activeTutors,
      activeStudents,
      completedTutorProfiles,
      completedStudentProfiles,
      featuredTutors,
      totalCategories,
      totalBookings,
      totalReviews: reviewStats._count.id,
      totalMessages
    },
    users: {
      total: totalUsers,
      activeTutors,
      activeStudents,
      completedTutorProfiles,
      completedStudentProfiles,
      last30DaysUsers,
      last30DaysTutors,
      last30DaysStudents
    },
    categories: {
      total: totalCategories,
      parentCategories,
      childCategories,
      assignedTutors
    },
    bookings: {
      total: totalBookings,
      today: bookingsToday,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
      statusBreakdown: bookingStatusStats,
      last7Days: last7DaysBookings,
      avgPerDay: Number(averageBookingsPerDay.toFixed(2))
    },
    reviews: {
      total: reviewStats._count.id,
      averageRating: Number(
        (reviewStats._avg.rating ?? 0).toFixed(2)
      )
    },
    contacts: {
      total: totalMessages
    },
    revenue: {
      // today: revenue.today,
      // last7Days: revenue.last7Days,
      today: 0,
      last7Days: 0
    },
    kpis: {
      completionRate: Number(completionRate.toFixed(2)),
      cancellationRate: Number(cancellationRate.toFixed(2))
    },
    charts: {
      bookingsLast7Days: last7DaysBookings
    }
  };
};
var updateUserStatus = async (adminId, targetUserId, status) => {
  const allowedStatuses = [Status.ACTIVE, Status.BLOCKED];
  if (!allowedStatuses.includes(status)) {
    throw new AppError(400, `Invalid status! Allowed: ${Status.ACTIVE} or ${Status.BLOCKED}`);
  }
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true }
  });
  if (!admin) {
    throw new AppError(401, "Admin user not found!");
  }
  if (admin.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Unauthorized access");
  }
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, status: true, role: true }
  });
  if (!targetUser) {
    throw new AppError(404, "Target user not found");
  }
  if (adminId === targetUserId) {
    throw new AppError(400, "You cannot change your own status");
  }
  if (targetUser.status === status) {
    throw new AppError(409, `User is already ${status}`);
  }
  if (targetUser.role === USER_ROLES.ADMIN && status === Status.BLOCKED) {
    throw new AppError(403, "Cannot deactivate another admin");
  }
  return prisma.user.update({
    where: { id: targetUserId },
    data: { status }
  });
};
var updateTutorFeatured = async (adminId, tutorId, isFeatured) => {
  const admin = await prisma.user.findUnique({
    where: {
      id: adminId
    },
    select: {
      role: true
    }
  });
  if (!admin) {
    throw new AppError(401, "Admin user not found");
  }
  if (admin.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Unauthorized access");
  }
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId
    },
    select: {
      id: true,
      isFeatured: true
    }
  });
  if (!tutor) {
    throw new AppError(404, "Tutor profile not found");
  }
  if (tutor.isFeatured === isFeatured) {
    throw new AppError(
      409,
      `Tutor is already ${isFeatured ? "featured" : "not featured"}`
    );
  }
  return prisma.tutorProfile.update({
    where: {
      id: tutorId
    },
    data: {
      isFeatured
    }
  });
};
var createContactMessage = async (payload) => {
  if (!payload.fullName || !payload.email || !payload.message) {
    throw new AppError(
      400,
      "Required fields are missing"
    );
  }
  if (!payload.inquiryType || payload.inquiryType.length === 0) {
    throw new AppError(
      400,
      "Select at least one inquiry type"
    );
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    throw new AppError(
      400,
      "Invalid email format"
    );
  }
  try {
    return await prisma.contactMessage.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone ?? null,
        userType: payload.userType,
        inquiryType: payload.inquiryType,
        message: payload.message
      }
    });
  } catch {
    throw new AppError(
      500,
      "Failed to create contact message"
    );
  }
};
var getAllMessages = async (adminId, query) => {
  const admin = await prisma.user.findUnique({
    where: {
      id: adminId
    },
    select: {
      role: true
    }
  });
  if (!admin) {
    throw new AppError(401, "Admin user not found");
  }
  if (admin.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Unauthorized access");
  }
  const {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  } = paginationSorting_helper_default(query);
  const searchTerm = query.searchTerm?.trim();
  const whereCondition = {
    ...query.userType && {
      userType: query.userType
    },
    ...query.inquiryType && {
      inquiryType: {
        has: query.inquiryType
      }
    },
    ...searchTerm && {
      OR: [
        {
          fullName: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          phone: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          message: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          inquiryType: {
            has: searchTerm
          }
        }
      ]
    }
  };
  let orderBy = {
    createdAt: sortOrder
  };
  switch (sortBy) {
    case "fullName":
      orderBy = {
        fullName: sortOrder
      };
      break;
    case "email":
      orderBy = {
        email: sortOrder
      };
      break;
    case "userType":
      orderBy = {
        userType: sortOrder
      };
      break;
    case "createdAt":
    default:
      orderBy = {
        createdAt: sortOrder
      };
  }
  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy
    }),
    prisma.contactMessage.count({
      where: whereCondition
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: messages
  };
};
var deleteMessage = async (adminId, messageId) => {
  const admin = await prisma.user.findUnique({
    where: {
      id: adminId
    },
    select: {
      role: true
    }
  });
  if (!admin) {
    throw new AppError(
      401,
      "Admin user not found"
    );
  }
  if (admin.role !== USER_ROLES.ADMIN) {
    throw new AppError(
      403,
      "Unauthorized access"
    );
  }
  const message = await prisma.contactMessage.findUnique({
    where: {
      id: messageId
    }
  });
  if (!message) {
    throw new AppError(
      404,
      "Message not found"
    );
  }
  try {
    return await prisma.contactMessage.delete({
      where: {
        id: messageId
      }
    });
  } catch {
    throw new AppError(
      500,
      "Failed to delete message"
    );
  }
};
var getReports = async (adminId, query) => {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true }
  });
  if (!admin) {
    throw new AppError(401, "Admin user not found");
  }
  if (admin.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Unauthorized access");
  }
  const type = query.type ?? "overview";
  const from = query.from ? new Date(query.from) : void 0;
  const to = query.to ? new Date(query.to) : void 0;
  const whereCreatedAt = from || to ? {
    createdAt: {
      ...from && { gte: from },
      ...to && { lte: to }
    }
  } : {};
  switch (type) {
    case "overview": {
      const [
        users,
        tutors,
        students,
        bookings,
        completedBookings,
        reviews,
        contacts
      ] = await Promise.all([
        prisma.user.count({
          where: {
            ...whereCreatedAt
          }
        }),
        prisma.user.count({
          where: {
            role: USER_ROLES.TUTOR,
            ...whereCreatedAt
          }
        }),
        prisma.user.count({
          where: {
            role: USER_ROLES.STUDENT,
            ...whereCreatedAt
          }
        }),
        prisma.booking.count({
          where: {
            ...whereCreatedAt
          }
        }),
        prisma.booking.count({
          where: {
            status: BookingStatus.COMPLETED,
            ...whereCreatedAt
          }
        }),
        prisma.review.aggregate({
          where: { ...whereCreatedAt },
          _count: { id: true },
          _avg: { rating: true }
        }),
        prisma.contactMessage.count({
          where: {
            ...whereCreatedAt
          }
        })
      ]);
      return {
        type,
        generatedAt: /* @__PURE__ */ new Date(),
        data: {
          totalUsers: users,
          totalTutors: tutors,
          totalStudents: students,
          totalBookings: bookings,
          completedBookings,
          totalReviews: reviews._count.id,
          averageRating: Number(
            (reviews._avg.rating ?? 0).toFixed(2)
          ),
          totalContacts: contacts
        }
      };
    }
    case "users": {
      const data = await prisma.user.findMany({
        where: {
          ...whereCreatedAt
        },
        include: {
          tutorProfile: {
            include: {
              categories: {
                include: {
                  category: true
                }
              }
            }
          },
          studentProfile: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      return {
        type,
        generatedAt: /* @__PURE__ */ new Date(),
        data
      };
    }
    case "bookings": {
      const data = await prisma.booking.findMany({
        where: {
          ...whereCreatedAt
        },
        include: {
          tutor: {
            include: {
              user: true
            }
          },
          student: {
            include: {
              user: true
            }
          },
          category: true,
          review: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      return {
        type,
        generatedAt: /* @__PURE__ */ new Date(),
        data
      };
    }
    case "reviews": {
      const data = await prisma.review.findMany({
        where: {
          ...whereCreatedAt
        },
        include: {
          tutor: {
            include: {
              user: true
            }
          },
          student: {
            include: {
              user: true
            }
          },
          booking: {
            include: {
              category: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      return {
        type,
        generatedAt: /* @__PURE__ */ new Date(),
        data
      };
    }
    case "categories": {
      const data = await prisma.categories.findMany({
        include: {
          _count: {
            select: {
              tutors: true
            }
          },
          parent: true
        },
        orderBy: {
          name: "asc"
        }
      });
      return {
        type,
        generatedAt: /* @__PURE__ */ new Date(),
        data
      };
    }
    case "contacts": {
      const data = await prisma.contactMessage.findMany({
        where: {
          ...whereCreatedAt
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      return {
        type,
        generatedAt: /* @__PURE__ */ new Date(),
        data
      };
    }
    default:
      throw new AppError(400, "Invalid report type");
  }
};
var generateReport = async (adminId, type, query) => {
  const admin = await prisma.user.findUnique({
    where: {
      id: adminId
    },
    select: {
      role: true
    }
  });
  if (!admin) {
    throw new AppError(401, "Admin user not found");
  }
  if (admin.role !== USER_ROLES.ADMIN) {
    throw new AppError(403, "Unauthorized access");
  }
  if (!REPORT_TYPES.includes(type)) {
    throw new AppError(400, "Invalid report type");
  }
  const from = query.from ? new Date(query.from) : void 0;
  const to = query.to ? new Date(query.to) : void 0;
  const whereCreatedAt = from || to ? {
    createdAt: {
      ...from && { gte: from },
      ...to && { lte: to }
    }
  } : {};
  let data;
  switch (type) {
    case "overview": {
      const [
        totalUsers,
        totalTutors,
        totalStudents,
        totalBookings,
        completedBookings,
        reviewStats,
        totalContacts
      ] = await Promise.all([
        prisma.user.count({
          where: whereCreatedAt
        }),
        prisma.user.count({
          where: {
            role: USER_ROLES.TUTOR,
            ...whereCreatedAt
          }
        }),
        prisma.user.count({
          where: {
            role: USER_ROLES.STUDENT,
            ...whereCreatedAt
          }
        }),
        prisma.booking.count({
          where: whereCreatedAt
        }),
        prisma.booking.count({
          where: {
            status: BookingStatus.COMPLETED,
            ...whereCreatedAt
          }
        }),
        prisma.review.aggregate({
          where: whereCreatedAt,
          _count: {
            id: true
          },
          _avg: {
            rating: true
          }
        }),
        prisma.contactMessage.count({
          where: whereCreatedAt
        })
      ]);
      data = {
        totalUsers,
        totalTutors,
        totalStudents,
        totalBookings,
        completedBookings,
        totalReviews: reviewStats._count.id,
        averageRating: Number(
          (reviewStats._avg.rating ?? 0).toFixed(2)
        ),
        totalContacts
      };
      break;
    }
    case "users":
      data = await prisma.user.findMany({
        where: whereCreatedAt,
        include: {
          tutorProfile: {
            include: {
              categories: {
                include: {
                  category: true
                }
              }
            }
          },
          studentProfile: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      break;
    case "bookings":
      data = await prisma.booking.findMany({
        where: whereCreatedAt,
        include: {
          tutor: {
            include: {
              user: true
            }
          },
          student: {
            include: {
              user: true
            }
          },
          category: true,
          review: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      break;
    case "reviews":
      data = await prisma.review.findMany({
        where: whereCreatedAt,
        include: {
          tutor: {
            include: {
              user: true
            }
          },
          student: {
            include: {
              user: true
            }
          },
          booking: {
            include: {
              category: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      break;
    case "categories":
      data = await prisma.categories.findMany({
        include: {
          parent: true,
          _count: {
            select: {
              tutors: true
            }
          }
        },
        orderBy: {
          name: "asc"
        }
      });
      break;
    case "contacts":
      data = await prisma.contactMessage.findMany({
        where: whereCreatedAt,
        orderBy: {
          createdAt: "desc"
        }
      });
      break;
  }
  return {
    type,
    from: query.from ?? null,
    to: query.to ?? null,
    generatedAt: /* @__PURE__ */ new Date(),
    data
  };
};
var AdminService = {
  getAllUsers,
  getPlatformAnalytics,
  updateUserStatus,
  updateTutorFeatured,
  createContactMessage,
  getAllMessages,
  deleteMessage,
  getReports,
  generateReport
};

// src/utils/reports/exportCsv.ts
import { Parser } from "json2csv";
var generateCSV = (data) => {
  const parser = new Parser();
  return parser.parse(data);
};

// src/utils/reports/exportExcel.ts
import ExcelJS from "exceljs";
var generateExcel = async (sheetName, data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  if (data.length > 0) {
    worksheet.columns = Object.keys(data[0]).map(
      (key) => ({
        header: key,
        key,
        width: 25
      })
    );
    worksheet.addRows(data);
  }
  return workbook.xlsx.writeBuffer();
};

// src/utils/reports/exportPdf.ts
import PDFDocument from "pdfkit";
var generatePDF = (title, report, res) => {
  const doc = new PDFDocument({
    margin: 40
  });
  res.setHeader(
    "Content-Type",
    "application/pdf"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${title}.pdf`
  );
  doc.pipe(res);
  doc.fontSize(20).text(title);
  doc.moveDown();
  doc.fontSize(12).text(
    `Generated At: ${report.generatedAt}`
  );
  doc.moveDown();
  doc.fontSize(10).text(
    JSON.stringify(report.data, null, 2)
  );
  doc.end();
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res, next) => {
  try {
    const adminId = req.user?.id;
    const query = req.query;
    const result = await AdminService.getAllUsers(adminId, query);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getPlatformAnalytics2 = async (req, res, next) => {
  try {
    const result = await AdminService.getPlatformAnalytics();
    res.status(200).json({
      success: true,
      message: "Platform analytics fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const adminId = req.user?.id;
    const { userId } = req.params;
    const { status } = req.body;
    const result = await AdminService.updateUserStatus(
      adminId,
      userId,
      status
    );
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateTutorFeatured2 = async (req, res, next) => {
  try {
    const adminId = req.user?.id;
    const { tutorId } = req.params;
    const { isFeatured } = req.body;
    const result = await AdminService.updateTutorFeatured(
      adminId,
      tutorId,
      Boolean(isFeatured)
    );
    res.status(200).json({
      success: true,
      message: "Tutor featured status updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createContactMessage2 = async (req, res, next) => {
  try {
    const result = await AdminService.createContactMessage(req.body);
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllMessages2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const query = req.query;
    const result = await AdminService.getAllMessages(userId, query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteMessage2 = async (req, res, next) => {
  try {
    const adminId = req.user?.id;
    const { messageId } = req.params;
    const result = await AdminService.deleteMessage(
      adminId,
      messageId
    );
    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getReports2 = async (req, res, next) => {
  try {
    const adminId = req.user?.id;
    const result = await AdminService.getReports(
      adminId,
      req.query
    );
    res.status(200).json({
      success: true,
      message: "Report generated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var generateReport2 = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { from, to, format = "json" } = req.query;
    const report = await AdminService.generateReport(
      req.user.id,
      type,
      {
        ...from && { from: String(from) },
        ...to && { to: String(to) }
      }
    );
    if (format === "json") {
      return res.status(200).json({
        success: true,
        message: `${type} report generated successfully`,
        data: report
      });
    }
    if (format === "csv") {
      const rows = Array.isArray(report?.data) ? report.data : [report?.data];
      const csv = generateCSV(rows);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${type}-report.csv`
      );
      return res.send(csv);
    }
    if (format === "xlsx") {
      const rows = Array.isArray(report?.data) ? report.data : [report?.data];
      const buffer = await generateExcel(
        `${type} Report`,
        rows
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${type}-report.xlsx`
      );
      return res.send(buffer);
    }
    if (format === "pdf") {
      return generatePDF(
        `${type} Report`,
        report,
        res
      );
    }
  } catch (error) {
    next(error);
  }
};
var AdminController = {
  getAllUsers: getAllUsers2,
  getPlatformAnalytics: getPlatformAnalytics2,
  updateUserStatus: updateUserStatus2,
  updateTutorFeatured: updateTutorFeatured2,
  createContactMessage: createContactMessage2,
  getAllMessages: getAllMessages2,
  deleteMessage: deleteMessage2,
  getReports: getReports2,
  generateReport: generateReport2
};

// src/modules/admin/admin.routes.ts
var router7 = Router7();
router7.get("/", auth_default(USER_ROLES.ADMIN), AdminController.getAllUsers);
router7.get("/platform", auth_default(USER_ROLES.ADMIN), AdminController.getPlatformAnalytics);
router7.patch("/:userId/status", auth_default(USER_ROLES.ADMIN), AdminController.updateUserStatus);
router7.patch(
  "/tutors/:tutorId/featured",
  auth_default(USER_ROLES.ADMIN),
  AdminController.updateTutorFeatured
);
router7.post("/contact", AdminController.createContactMessage);
router7.get("/contact", auth_default(USER_ROLES.ADMIN), AdminController.getAllMessages);
router7.delete("/contact/:messageId", auth_default(USER_ROLES.ADMIN), AdminController.deleteMessage);
router7.get(
  "/reports",
  auth_default(USER_ROLES.ADMIN),
  AdminController.getReports
);
router7.get(
  "/reports/:type",
  auth_default(USER_ROLES.ADMIN),
  AdminController.generateReport
);
var AdminRoutes = router7;

// src/errors/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    path: req.originalUrl,
    error: err
  });
};

// src/middlewares/notFound.ts
var notFound = (req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
};

// src/modules/users/user.routes.ts
import { Router as Router8 } from "express";

// src/modules/users/user.service.ts
var APP_URL2 = env.APP_URL;
var updateUserRole = async (userId, payload) => {
  if (payload.role === USER_ROLES.ADMIN) {
    throw new AppError(404, "Role can't be Admin, Admins are feed");
  }
  const existing = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!existing) {
    throw new AppError(404, "User not found");
  }
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      role: payload.role
    }
  });
  return user;
};
var updateProfileImage = async (userId, payload) => {
  if (!payload.image) {
    throw new AppError(404, "Image not found");
  }
  const existing = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!existing) {
    throw new AppError(404, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      image: payload.image
    }
  });
  return updatedUser;
};
var resendVerificationEmail = async (email) => {
  if (!email) {
    throw new AppError(404, "Email is required");
  }
  const existing = await prisma.user.findUnique({
    where: { email }
  });
  if (!existing) {
    throw new AppError(404, "User not found");
  }
  if (existing.emailVerified) {
    throw new AppError(400, "Email is already verified");
  }
  await auth.api.sendVerificationEmail({
    body: {
      email,
      callbackURL: `${APP_URL2}/onboarding`
    }
  });
  return {
    message: "Verification email sent successfully"
  };
};
var UserService = {
  updateUserRole,
  updateProfileImage,
  resendVerificationEmail
};

// src/modules/users/user.controller.ts
var updateUserRole2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await UserService.updateUserRole(userId, req.body);
    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateProfileImage2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await UserService.updateProfileImage(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var resendVerificationEmail2 = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await UserService.resendVerificationEmail(email);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
var UserController = {
  updateUserRole: updateUserRole2,
  updateProfileImage: updateProfileImage2,
  resendVerificationEmail: resendVerificationEmail2
};

// src/modules/users/user.routes.ts
var router8 = Router8();
router8.patch("/select-role", auth_default(), UserController.updateUserRole);
router8.patch("/profile-image", auth_default(USER_ROLES.TUTOR, USER_ROLES.STUDENT), UserController.updateProfileImage);
router8.post("/resend-verification", UserController.resendVerificationEmail);
var UserRoutes = router8;

// src/modules/conversation/conversation.routes.ts
import { Router as Router9 } from "express";

// src/socket/socket.ts
import { createServer } from "http";
import { Server } from "socket.io";

// src/socket/middleware/socketAuth.ts
var socketAuth = async (socket, next) => {
  try {
    const session = await auth.api.getSession({
      headers: socket.handshake.headers
    });
    console.log(socket.handshake.headers);
    if (!session) {
      return next(new AppError(401, "Unauthorized"));
    }
    if (!session.user.emailVerified) {
      return next(
        new AppError(
          403,
          "Please verify your email."
        )
      );
    }
    if (session.user.status === Status.BLOCKED) {
      return next(
        new AppError(
          403,
          "Account blocked."
        )
      );
    }
    socket.data.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      emailVerified: session.user.emailVerified,
      role: session.user.role,
      status: session.user.status,
      profileCompleted: session.user.profileCompleted
    };
    next();
  } catch (error) {
    next(new AppError(401, "Unauthorized"));
  }
};

// src/socket/socket.events.ts
var SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  MESSAGE_NEW: "message:new",
  MESSAGE_READ: "message:read",
  CONVERSATION_UPDATED: "conversation:updated",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  CONVERSATION_JOIN: "conversation:join",
  CONVERSATION_LEAVE: "conversation:leave",
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
  PRESENCE_INIT: "presence:init"
};
var registerSocketEvents = (io2, socket) => {
  console.log("Connected:", socket.data.user.id);
  socket.on(
    SOCKET_EVENTS.CONVERSATION_JOIN,
    (conversationId) => {
      socket.join(conversationId);
      console.log(
        `${socket.data.user.id} joined ${conversationId}`
      );
    }
  );
  socket.on(
    SOCKET_EVENTS.CONVERSATION_LEAVE,
    (conversationId) => {
      socket.leave(conversationId);
      console.log(
        `${socket.data.user.id} left ${conversationId}`
      );
    }
  );
  socket.on(
    SOCKET_EVENTS.TYPING_START,
    (conversationId) => {
      socket.to(conversationId).emit(
        SOCKET_EVENTS.TYPING_START,
        {
          conversationId,
          userId: socket.data.user.id
        }
      );
    }
  );
  socket.on(
    SOCKET_EVENTS.TYPING_STOP,
    (conversationId) => {
      socket.to(conversationId).emit(
        SOCKET_EVENTS.TYPING_STOP,
        {
          conversationId,
          userId: socket.data.user.id
        }
      );
    }
  );
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(
      `${socket.data.user.id} disconnected`
    );
  });
};

// src/socket/presence.ts
var onlineUsers = /* @__PURE__ */ new Map();
var Presence = {
  add(userId, socketId) {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, /* @__PURE__ */ new Set());
    }
    onlineUsers.get(userId).add(socketId);
  },
  remove(userId, socketId) {
    const sockets = onlineUsers.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (sockets.size === 0) {
      onlineUsers.delete(userId);
    }
  },
  isOnline(userId) {
    return onlineUsers.has(userId);
  },
  getOnlineUsers() {
    return [...onlineUsers.keys()];
  },
  count() {
    return onlineUsers.size;
  }
};

// src/socket/socket.ts
var FRONTEND_URL = env.APP_URL;
var io;
var initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: FRONTEND_URL,
      credentials: true
    }
  });
  io.use(socketAuth);
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`\u{1F7E2} Socket connected: ${socket.id}`);
    console.log({
      socket: socket.id,
      user: socket.data.user
    });
    const userId = socket.data.user.id;
    Presence.add(userId, socket.id);
    socket.join(userId);
    socket.emit(
      SOCKET_EVENTS.PRESENCE_INIT,
      Presence.getOnlineUsers()
    );
    console.log(
      `${userId} joined personal room`
    );
    socket.broadcast.emit(
      SOCKET_EVENTS.USER_ONLINE,
      {
        userId
      }
    );
    registerSocketEvents(io, socket);
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      const userId2 = socket.data.user.id;
      Presence.remove(userId2, socket.id);
      if (!Presence.isOnline(userId2)) {
        socket.broadcast.emit(
          SOCKET_EVENTS.USER_OFFLINE,
          {
            userId: userId2
          }
        );
      }
      console.log(`\u{1F534} ${userId2} disconnected`);
      console.log(`\u{1F534} Socket disconnected: ${socket.id}`);
    });
  });
  return io;
};
var getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized."
    );
  }
  return io;
};

// src/socket/socketEmitter.ts
var emitToUser = (userId, event, payload) => {
  getIO().to(userId).emit(event, payload);
};

// src/modules/conversation/conversation.service.ts
var getMyConversations = async (userId, query) => {
  const { page, limit, skip } = paginationSorting_helper_default(query);
  const search = query.searchTerm?.trim();
  const whereCondition = search ? {
    AND: [
      {
        participants: {
          some: {
            userId
          }
        }
      },
      {
        participants: {
          some: {
            user: {
              name: {
                contains: search,
                mode: "insensitive"
              }
            }
          }
        }
      }
    ]
  } : {
    participants: {
      some: {
        userId
      }
    }
  };
  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where: whereCondition,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: {
                  not: userId
                },
                isRead: false
              }
            }
          }
        }
      },
      orderBy: {
        lastMessageAt: "desc"
      },
      take: limit,
      skip
    }),
    prisma.conversation.count({
      where: whereCondition
    })
  ]);
  const formattedConversations = conversations.map(
    ({ _count, ...conversation }) => ({
      ...conversation,
      unreadCount: _count.messages
    })
  );
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: formattedConversations
  };
};
var getContacts = async (userId) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      role: true
    }
  });
  if (!currentUser) {
    throw new AppError(404, "User not found");
  }
  if (currentUser.role === USER_ROLES.ADMIN) {
    throw new AppError(
      403,
      "Only tutors and students can access contacts."
    );
  }
  const contactsMap = /* @__PURE__ */ new Map();
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId
        }
      }
    },
    select: {
      id: true,
      participants: {
        select: {
          userId: true
        }
      }
    }
  });
  if (currentUser.role === USER_ROLES.TUTOR) {
    const bookings = await prisma.booking.findMany({
      where: {
        tutor: {
          userId
        },
        status: {
          notIn: [
            BookingStatus.CANCELLED,
            BookingStatus.DECLINED
          ]
        }
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    });
    for (const booking of bookings) {
      const user = booking.student.user;
      if (contactsMap.has(user.id)) {
        continue;
      }
      const conversation = conversations.find(
        (conversation2) => conversation2.participants.some(
          (participant) => participant.userId === user.id
        )
      );
      contactsMap.set(user.id, {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        conversationId: conversation?.id ?? null
      });
    }
  }
  if (currentUser.role === USER_ROLES.STUDENT) {
    const bookings = await prisma.booking.findMany({
      where: {
        student: {
          userId
        },
        status: {
          notIn: [
            BookingStatus.CANCELLED,
            BookingStatus.DECLINED
          ]
        }
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    });
    for (const booking of bookings) {
      const user = booking.tutor.user;
      if (contactsMap.has(user.id)) {
        continue;
      }
      const conversation = conversations.find(
        (conversation2) => conversation2.participants.some(
          (participant) => participant.userId === user.id
        )
      );
      contactsMap.set(user.id, {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        conversationId: conversation?.id ?? null
      });
    }
  }
  return [...contactsMap.values()].sort(
    (a, b) => a.name.localeCompare(b.name)
  );
};
var getConversationById = async (userId, conversationId) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: {
          userId
        }
      }
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true
            }
          }
        }
      },
      messages: {
        orderBy: {
          createdAt: "asc"
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      },
      _count: {
        select: {
          messages: {
            where: {
              senderId: {
                not: userId
              },
              isRead: false
            }
          }
        }
      }
    }
  });
  if (!conversation) {
    throw new AppError(
      404,
      "Conversation not found"
    );
  }
  const { _count, ...rest } = conversation;
  return {
    ...rest,
    unreadCount: _count.messages
  };
};
var createConversation = async (userId, payload) => {
  if (userId === payload.participantId) {
    throw new AppError(400, "You cannot message yourself");
  }
  const [currentUser, participant] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true
      }
    }),
    prisma.user.findUnique({
      where: { id: payload.participantId },
      select: {
        id: true,
        role: true
      }
    })
  ]);
  if (!currentUser) {
    throw new AppError(404, "User not found");
  }
  if (!participant) {
    throw new AppError(404, "Participant not found");
  }
  if (currentUser.role === participant.role) {
    throw new AppError(
      403,
      "Conversations are only allowed between a tutor and a student."
    );
  }
  const booking = await prisma.booking.findFirst({
    where: currentUser.role === USER_ROLES.STUDENT ? {
      student: {
        userId
      },
      tutor: {
        userId: payload.participantId
      },
      status: {
        notIn: [
          BookingStatus.CANCELLED,
          BookingStatus.DECLINED
        ]
      }
    } : {
      tutor: {
        userId
      },
      student: {
        userId: payload.participantId
      },
      status: {
        notIn: [
          BookingStatus.CANCELLED,
          BookingStatus.DECLINED
        ]
      }
    },
    select: {
      id: true
    }
  });
  if (!booking) {
    throw new AppError(
      403,
      "You can only message users you have booked sessions with."
    );
  }
  const conversations = await prisma.conversation.findMany({
    where: {
      AND: [
        {
          participants: {
            some: {
              userId
            }
          }
        },
        {
          participants: {
            some: {
              userId: payload.participantId
            }
          }
        }
      ]
    },
    include: {
      participants: {
        include: {
          user: true
        }
      }
    }
  });
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: {
              userId
            }
          }
        },
        {
          participants: {
            some: {
              userId: payload.participantId
            }
          }
        }
      ]
    },
    include: {
      participants: {
        include: {
          user: true
        }
      }
    }
  });
  if (existing && existing.participants.length === 2) {
    return existing;
  }
  return prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId },
          { userId: payload.participantId }
        ]
      }
    },
    include: {
      participants: {
        include: {
          user: true
        }
      }
    }
  });
};
var markConversationRead = async (userId, conversationId) => {
  return prisma.$transaction(async (tx) => {
    const conversation = await tx.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            userId
          }
        }
      },
      include: {
        participants: {
          select: {
            userId: true
          }
        }
      }
    });
    if (!conversation) {
      throw new AppError(404, "Conversation not found");
    }
    const { count } = await tx.message.updateMany({
      where: {
        conversationId,
        senderId: {
          not: userId
        },
        isRead: false
      },
      data: {
        isRead: true
      }
    });
    return {
      participants: conversation.participants,
      count
    };
  }).then((result) => {
    emitToUser(userId, "conversation:updated", {
      conversationId,
      unreadCount: 0
    });
    result.participants.forEach((participant) => {
      if (participant.userId !== userId) {
        emitToUser(
          participant.userId,
          "conversation:read",
          {
            conversationId,
            readBy: userId
          }
        );
      }
    });
    return {
      success: true,
      message: "Conversation marked as read",
      markedAsRead: result.count
    };
  });
};
var ConversationService = {
  getMyConversations,
  getContacts,
  getConversationById,
  createConversation,
  markConversationRead
};

// src/modules/conversation/conversation.controller.ts
var getMyConversations2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const query = req.query;
    const result = await ConversationService.getMyConversations(
      userId,
      query
    );
    res.status(200).json({
      success: true,
      message: "Conversations fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getContacts2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await ConversationService.getContacts(
      userId
    );
    res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getConversationById2 = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      throw new AppError(400, "Conversation ID is required");
    }
    const userId = req.user?.id;
    const result = await ConversationService.getConversationById(
      userId,
      conversationId
    );
    res.status(200).json({
      success: true,
      message: "Conversation fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createConversation2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await ConversationService.createConversation(
      userId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var markConversationRead2 = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      throw new AppError(400, "Conversation ID is required");
    }
    const userId = req.user?.id;
    const result = await ConversationService.markConversationRead(
      userId,
      conversationId
    );
    res.status(200).json({
      success: true,
      message: "Conversation marked as read",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var ConversationController = {
  getMyConversations: getMyConversations2,
  getContacts: getContacts2,
  getConversationById: getConversationById2,
  createConversation: createConversation2,
  markConversationRead: markConversationRead2
};

// src/modules/conversation/conversation.routes.ts
var router9 = Router9();
router9.get(
  "/",
  auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
  ConversationController.getMyConversations
);
router9.get(
  "/contacts",
  auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
  ConversationController.getContacts
);
router9.get(
  "/:conversationId",
  auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
  ConversationController.getConversationById
);
router9.post(
  "/",
  auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
  ConversationController.createConversation
);
router9.patch(
  "/:conversationId/read",
  auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
  ConversationController.markConversationRead
);
var ConversationRoutes = router9;

// src/modules/message/message.routes.ts
import { Router as Router10 } from "express";

// src/modules/message/message.service.ts
var getMessages = async (userId, conversationId) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: {
          userId
        }
      }
    }
  });
  if (!conversation) {
    throw new AppError(
      404,
      "Conversation not found or access denied"
    );
  }
  return prisma.message.findMany({
    where: {
      conversationId
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
};
var sendMessage = async (userId, conversationId, payload) => {
  if (!payload.content?.trim()) {
    throw new AppError(400, "Message content is required");
  }
  const { message, participantIds } = await prisma.$transaction(
    async (tx) => {
      const conversation = await tx.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: {
              userId
            }
          }
        }
      });
      if (!conversation) {
        throw new AppError(
          404,
          "Conversation not found or access denied"
        );
      }
      const message2 = await tx.message.create({
        data: {
          conversationId,
          senderId: userId,
          content: payload.content.trim()
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      });
      await tx.conversation.update({
        where: {
          id: conversationId
        },
        data: {
          lastMessageAt: message2.createdAt
        }
      });
      const participants = await tx.conversationParticipant.findMany({
        where: {
          conversationId
        },
        select: {
          userId: true
        }
      });
      return {
        message: message2,
        participantIds: participants.map((p) => p.userId)
      };
    }
  );
  for (const participantId of participantIds) {
    emitToUser(participantId, "message:new", message);
    const unreadCount = await prisma.message.count({
      where: {
        conversationId,
        senderId: {
          not: participantId
        },
        isRead: false
      }
    });
    emitToUser(participantId, "conversation:updated", {
      conversationId,
      lastMessage: message,
      unreadCount
    });
    console.log("Emitting message:new to", participantId);
  }
  return message;
};
var markMessageRead = async (userId, messageId) => {
  const { updatedMessage, participants } = await prisma.$transaction(async (tx) => {
    const message = await tx.message.findUnique({
      where: {
        id: messageId
      },
      include: {
        conversation: {
          include: {
            participants: true
          }
        }
      }
    });
    if (!message) {
      throw new AppError(404, "Message not found");
    }
    const isParticipant = message.conversation.participants.some(
      (participant) => participant.userId === userId
    );
    if (!isParticipant) {
      throw new AppError(
        403,
        "You are not a participant in this conversation"
      );
    }
    if (message.senderId === userId) {
      throw new AppError(
        400,
        "You cannot mark your own message as read"
      );
    }
    if (message.isRead) {
      return {
        updatedMessage: message,
        participants: message.conversation.participants.map(
          (participant) => ({
            userId: participant.userId
          })
        )
      };
    }
    const updatedMessage2 = await tx.message.update({
      where: {
        id: messageId
      },
      data: {
        isRead: true
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });
    const participants2 = await tx.conversationParticipant.findMany({
      where: {
        conversationId: updatedMessage2.conversationId
      },
      select: {
        userId: true
      }
    });
    return {
      updatedMessage: updatedMessage2,
      participants: participants2
    };
  });
  participants.forEach((participant) => {
    if (participant.userId === userId) return;
    emitToUser(participant.userId, "message:read", {
      messageId: updatedMessage.id,
      conversationId: updatedMessage.conversationId,
      readBy: userId,
      readAt: /* @__PURE__ */ new Date()
    });
    emitToUser(participant.userId, "conversation:updated", {
      conversationId: updatedMessage.conversationId,
      unreadReset: true
    });
  });
  return updatedMessage;
};
var MessageService = {
  getMessages,
  sendMessage,
  markMessageRead
};

// src/modules/message/message.controller.ts
var getMessages2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { conversationId } = req.params;
    if (!conversationId) {
      throw new AppError(400, "Conversation ID is required");
    }
    const result = await MessageService.getMessages(
      userId,
      conversationId
    );
    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var sendMessage2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { conversationId } = req.params;
    if (!conversationId) {
      throw new AppError(400, "Conversation ID is required");
    }
    const result = await MessageService.sendMessage(
      userId,
      conversationId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var markMessageRead2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { messageId } = req.params;
    if (!messageId) {
      throw new AppError(400, "Message ID is required");
    }
    const result = await MessageService.markMessageRead(
      userId,
      messageId
    );
    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var MessageController = {
  getMessages: getMessages2,
  sendMessage: sendMessage2,
  markMessageRead: markMessageRead2
};

// src/modules/message/message.routes.ts
var router10 = Router10();
router10.get(
  "/:conversationId",
  auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
  MessageController.getMessages
);
router10.post(
  "/:conversationId",
  auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
  MessageController.sendMessage
);
router10.patch(
  "/:messageId/read",
  auth_default(USER_ROLES.STUDENT, USER_ROLES.TUTOR),
  MessageController.markMessageRead
);
var MessageRoutes = router10;

// src/app.ts
var app = express4();
app.use((0, import_cors.default)({
  origin: env.APP_URL || "http://localhost:3000",
  credentials: true
  // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express4.json());
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/admin", AdminRoutes);
app.use("/users", UserRoutes);
app.use("/tutors", TutorRoutes);
app.use("/students", StudentRoutes);
app.use("/category", CategoryRoutes);
app.use("/availability", AvailabilityRoutes);
app.use("/booking", BookingRoutes);
app.use("/review", ReviewRoutes);
app.use("/conversation", ConversationRoutes);
app.use("/message", MessageRoutes);
app.get("/", (req, res) => {
  res.send("Hello from Sabrina ^.^");
});
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var port = Number(env.PORT);
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    const httpServer = createServer(app_default);
    initializeSocket(httpServer);
    httpServer.listen(port, () => {
      console.log(
        `Server is running on http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
}
main();
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});
/*! Bundled license information:

object-assign/index.js:
  (*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  *)

vary/index.js:
  (*!
   * vary
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
