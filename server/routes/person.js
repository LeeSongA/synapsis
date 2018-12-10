const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Person = require("../models/person");
const Team = require("../models/team");
const User = require('../models/user');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// 전체 용병 목록 받아오기
router.get("/", function(req, res) {
  Person.find({}, function(err, result) {
    if (err) return res.status(500).send({ error: "DB is not found!" });
    res.json(result);
  });
});

// 용병 등록하기.
router.post("/register", function(req, res) {
  var person = new Person();

  person.user_id = req.body.user_id;
  person.teamName = req.body.teamName;
  person.date = req.body.date;
  person.time = req.body.time;
  person.sportsCategory = req.body.sportsCategory;

  if(req.body.sportsCategory == 1){person.sportsCategory = "basketball"}
  else if(req.body.sportsCategory == 2){person.sportsCategory = "soccer"}
  else{person.sportsCategory = "baseball"}

  person.position = req.body.position;
  person.region = req.body.region;
  person.comment = req.body.comment;
  person.isChecked = false; // 초기 계약 false

  person.save(function(err) {
    if (err) {
      console.error(err);
      return;
    }
    res.json({ result: 1 });
  });
});

// 용병 상세 보기.
router.get("/:index", function(req, res) {
  var idx = req.params.index;

  // 인덱스에 해당하는 게시글 불러오기.
  Person.find({ index: idx }, function(err, result) {
    if (err) return res.status(500).send({ error: "해당 글이 없습니다." });
    console.log(result);
    res.json(result);
  });
});

// 용병이 팀한테서 온 용병 채용을 승낙.
router.post("/accept", function(req, res) {
  var idx = req.body.index;
  var user_id = req.body.user_id;
  var team;

  User.findOne({ id: user_id },function(err,result) {
    if (err) return res.status(500).send({ error: "로그인 에러 발생!" });
    team = result.teamName;
    
    Team.updateOne({ teamName: team },{ $addToSet: { $push: { personList : user_id }}},function(err) {
      if (err) return res.status(500).send({ error: "팀정보 업데이트중 에러발생!" });
    });

    Person.update({ index: idx },{$set:{ teamName : team , isChecked : true} },function(err) {
      if (err) return res.status(500).send({ error: "용병정보 업데이트중 에러발생!" });
    });
    res.json({ success:1 });
  });



});
// 용병채용이 승락된후 채용팀에 용병을 추가.
router.get("/sendteam", function(req, res) {
  var idx = req.params.index;

  // 인덱스에 해당하는 게시글 불러오기.
  Person.find({ index: idx }, function(err, result) {
    if (err) return res.status(500).send({ error: "해당 글이 없습니다." });
    console.log(result);
    res.json(result);
  });
});

module.exports = router;
