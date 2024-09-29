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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var admin = require("firebase-admin");
var serviceAccount = require("./crying-chair-firebase-adminsdk-chqay-8460731472.json");
var fs = require("fs");
var questionsData = JSON.parse(fs.readFileSync('./output.json', 'utf-8'));
var statsData = JSON.parse(fs.readFileSync('./stats.json', 'utf-8'));
var categoryData = JSON.parse(fs.readFileSync('./cats.json', 'utf-8'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();
function uploadQuestions() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, question, questionDetails, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _i = 0, _a = questionsData;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    question = _a[_i];
                    questionDetails = question;
                    return [4 /*yield*/, db.collection('Questions').doc(String(question.qid)).set(questionDetails)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Questions 上傳完成");
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.error("上傳 Questions 時出錯: ", error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function uploadStats() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, stat, statDetails, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _i = 0, _a = statsData;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    stat = _a[_i];
                    statDetails = stat;
                    return [4 /*yield*/, db.collection('Stats').doc(String(stat.qid)).set(statDetails)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Stats 上傳完成");
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    console.error("上傳 Stats 時出錯: ", error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function updateCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, _b, category, qidArray, categoryDocRef, _c, qidArray_1, qid, error_3;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 7, , 8]);
                    _i = 0, _a = Object.entries(categoryData);
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    _b = _a[_i], category = _b[0], qidArray = _b[1];
                    categoryDocRef = db.collection('Category').doc(category);
                    _c = 0, qidArray_1 = qidArray;
                    _d.label = 2;
                case 2:
                    if (!(_c < qidArray_1.length)) return [3 /*break*/, 5];
                    qid = qidArray_1[_c];
                    return [4 /*yield*/, categoryDocRef.update({
                            qids: admin.firestore.FieldValue.arrayUnion(qid)
                        })];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _c++;
                    return [3 /*break*/, 2];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("Category 更新完成");
                    return [3 /*break*/, 8];
                case 7:
                    error_3 = _d.sent();
                    console.error("更新 Category 時出錯: ", error_3);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function uploadAllData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, uploadQuestions()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uploadStats()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, updateCategories()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
uploadAllData().then(function () {
    console.log("所有資料上傳完成");
});
