"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var fs = require("fs");
var firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
(0, app_1.initializeApp)(firebaseConfig);
var db = (0, firestore_1.getFirestore)();
var file1 = JSON.parse(fs.readFileSync("./output.json", "utf-8"));
var file2 = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));
var file3 = JSON.parse(fs.readFileSync("./cats.json", "utf-8"));
var qidToDocId = {};
var addQuestions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, file1_1, item, docRef, docId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, file1_1 = file1;
                _a.label = 1;
            case 1:
                if (!(_i < file1_1.length)) return [3 /*break*/, 5];
                item = file1_1[_i];
                return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(db, "Questions"), item)];
            case 2:
                docRef = _a.sent();
                docId = docRef.id;
                qidToDocId[item.qid] = docId;
                return [4 /*yield*/, (0, firestore_1.setDoc)(docRef, item)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
var addStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, file2_1, item, docId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, file2_1 = file2;
                _a.label = 1;
            case 1:
                if (!(_i < file2_1.length)) return [3 /*break*/, 5];
                item = file2_1[_i];
                docId = qidToDocId[item.qid];
                if (!docId) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(db, "Stats", docId), item)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                console.warn("No matching document ID found for qid: ".concat(item.qid));
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
var updateCat = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, _b, key, elements, docRef;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _i = 0, _a = Object.entries(file3);
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                _b = _a[_i], key = _b[0], elements = _b[1];
                docRef = (0, firestore_1.doc)(db, "Category", key);
                return [4 /*yield*/, (0, firestore_1.updateDoc)(docRef, {
                        qids: firestore_1.arrayUnion.apply(void 0, elements),
                    })];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 執行上傳
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, addQuestions()];
            case 1:
                _a.sent();
                return [4 /*yield*/, addStatus()];
            case 2:
                _a.sent();
                return [4 /*yield*/, updateCat()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
run().catch(console.error);
