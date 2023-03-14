import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useMemo } from "react";
import Loading from "../Loading";
import dayjs from "dayjs";
faker.locale = "ko";
const FakeUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cupId, setCupId] = useState("");
  const [fakeUsers, setFakeUsers] = useState([]);
  const [fakeResult, setFakeResult] = useState([]);
  const [fakeLength, setFakeLength] = useState(0);
  const [getCupDatas, setGetCupDatas] = useState([]);

  const getCupsInApplication = async () => {
    const q = query(
      collection(db, "cups"),
      where("cupInfo.cupState", "==", "신청접수중")
    );
    const querySnapshot = await getDocs(q);
    const cups = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return cups;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCupsInApplication();
      setGetCupDatas(data);
      setIsLoading(false);
    };

    fetchData();

    return async () => {
      const data = await getCupsInApplication();
      setGetCupDatas(data);
    };
  }, []);

  // getCupDatas.length 대신 getCupDatas를 사용
  useMemo(() => {
    if (!getCupDatas.length) {
      return;
    }
    setCupId(getCupDatas[0].id);
    setIsLoading(false);
  }, [getCupDatas]);

  const generateBirthDate = () => {
    const maxYearAgo = dayjs().subtract(15, "year").year(); // 15년 전 연도
    const minYearAgo = dayjs().subtract(80, "year").year(); // 80년 전 연도
    const birthYear = Math.floor(
      Math.random() * (maxYearAgo - minYearAgo + 1) + minYearAgo
    ); // 무작위 생년 연도
    const pBirth = dayjs().year(birthYear).format("YYYY-MM-DD"); // 생년월일 문자열 생성
    return pBirth;
  };

  const generateUser = () => {
    const pName = faker.name.lastName() + faker.name.firstName();
    const pEmail = faker.internet.email();
    const pTel = "010-" + faker.helpers.replaceSymbolWithNumber("####-####");
    const pRegion = faker.address.cityName();
    const pGender = faker.datatype.boolean() ? "m" : "f";
    const pBirth = generateBirthDate();
    const pUid = faker.datatype.uuid();
    const pId = faker.datatype.uuid();
    const pPic = faker.image.avatar();

    return {
      pName,
      pEmail,
      pTel,
      pRegion,
      pGender,
      pBirth,
      pUid,
      pId,
      pPic,
    };
  };

  const generateId = () => {
    const randomString = Math.random().toString(36).substring(2, 6);
    const id = (
      randomString +
      "-" +
      Date.now().toString().substr(-6)
    ).toUpperCase();
    return id;
  };

  const handleFake = async () => {
    const filteredCup = getCupDatas.filter((cup) => cup.id === cupId)[0];
    const generateInvoiceDate = () => {
      const startDate = filteredCup.cupInfo.cupDate.startDate;
      const endDate = dayjs().subtract(1, "day"); // 오늘 이전 날짜
      const diffDays = endDate.diff(startDate, "day"); // 시작일과 끝일의 차이 (일 수)
      const randomDays = Math.floor(Math.random() * diffDays) + 1; // 랜덤하게 선택한 일 수
      const invoiceDate = dayjs(startDate).add(randomDays, "day").format(); // 시작일 + 랜덤한 일 수
      return invoiceDate;
    };

    let fakeArray = [];
    for (let i = 0; i < fakeLength; i++) {
      const invoiceDate = generateInvoiceDate(
        filteredCup.cupInfo.cupDate.startDate
      );
      const user = generateUser();
      const joinGames = await generateCupsJoin(user.pGender); // 무작위 게임 선택하여 joinGames 배열 생성
      user.joinGames = joinGames; // joinGames 배열을 user 객체의 joinGames 프로퍼티에 추가
      const cupInfo = {
        cupId: cupId,
        cupName: filteredCup.cupInfo.cupName,
        cupOrg: filteredCup.cupInfo.cupOrg,
        cupDate: filteredCup.cupInfo.cupDate.startDate,
        feeInfo: { incomeFee: 0, joinFee: 100000 },
        isConfirmed: false,
      };
      fakeArray.push({
        ...user,
        ...cupInfo,
        docuId: generateId(),
        invoiceDate,
      });
    }
    console.log(fakeArray);

    const cupsJoinCollectionRef = collection(db, "cupsjoin"); // cupsjoin 컬렉션 ref
    for (const user of fakeArray) {
      // 사용자 문서 추가
      await addDoc(cupsJoinCollectionRef, user);
    }

    // setFakeUsers를 호출하여 화면에 표시
    setFakeUsers(fakeArray);
  };

  // gamesCategory 컬렉션에서 무작위 게임 1~5개 선택
  const selectRandomGames = (games) => {
    const numGames = Math.floor(Math.random() * 5) + 1; // 무작위 개수 선택 (1~5개)
    const selectedGames = games
      .sort(() => 0.5 - Math.random())
      .slice(0, numGames); // 무작위 게임 선택
    return selectedGames;
  };

  // cupsjoin 객체 생성
  const createCupsJoin = (game) => {
    const gameClass =
      game.class[Math.floor(Math.random() * game.class.length)].title; // 무작위 클래스 선택
    return { gameClass, gameTitle: game.title, id: game.id };
  };

  // cupsjoin 객체 추가
  const addCupsJoin = async (cupsJoin) => {
    const cupsJoinCollectionRef = collection(db, "cupsjoin"); // cupsjoin 컬렉션 ref
    for (const join of cupsJoin) {
      await addDoc(cupsJoinCollectionRef, join); // join 객체를 문서로 추가
    }
  };

  // gamesCategory 컬렉션에서 무작위 게임 선택하여 cupsjoin 객체 생성 및 콘솔에 출력
  const generateCupsJoin = (pGender) => {
    const games = JSON.parse(localStorage.getItem("gamesCategory")); // 로컬 스토리지에서 gamesCategory 데이터 가져오기
    const filteredGames = games.filter((game) => game.gender === pGender); // gender가 일치하는 게임만 필터링
    const selectedGames = selectRandomGames(filteredGames); // 무작위 게임 선택
    const joinGames = selectedGames.map((game) => createCupsJoin(game)); // joinGames 배열 생성
    return joinGames; // joinGames 배열 반환
  };

  // 테스트
  //generateCupsJoin();

  const saveGamesToLocalStorage = async () => {
    const gamesSnapshot = await getDocs(collection(db, "gamesCategory"));
    const games = gamesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    localStorage.setItem("gamesCategory", JSON.stringify(games));
  };

  const handleSaveGames = () => {
    saveGamesToLocalStorage();
  };

  return (
    <div className="flex w-full bg-gray-900 h-full flex-col justify-start items-center p-2 gap-y-2">
      {isLoading && <Loading />}
      {getCupDatas.length && (
        <div className="flex w-full bg-gray-900 h-full flex-col justify-start items-center p-2 gap-y-5">
          <div className="flex text-white justify-start w-full gap-x-5">
            <div className="flex justify-start items-center">대회선택</div>
            <select
              name="cupSelect"
              className=" bg-transparent"
              onChange={(e) => setCupId(e.target.value)}
            >
              {getCupDatas.map((cup) => (
                <option className="bg-transparent text-black" value={cup.id}>
                  {cup.cupInfo.cupName}
                </option>
              ))}
            </select>
          </div>
          <div
            className="flex bg-gray-800 h-14 justify-start items-center w-full p-2"
            style={{ minWidth: "500px" }}
          >
            <input
              type="text"
              name="fakeLength"
              placeholder="갯수"
              className="flex w-20 h-10 bg-transparent ml-5 text-white placeholder:text-gray-200"
              onChange={(e) => {
                setFakeLength(e.target.value);
              }}
            />
            <button
              className="flex  w-40 h-full text-white justify-center items-center border"
              onClick={() => handleSaveGames()}
            >
              <span>종목불러오기</span>
            </button>
            <button
              className="flex  w-20 h-full text-white justify-center items-center border"
              onClick={() => setFakeUsers(handleFake())}
            >
              <span>만들기</span>
            </button>
          </div>
          <div className="flex w-full h-full flex-col">
            {fakeUsers.length &&
              fakeUsers.map((user) => (
                <div className="flex">
                  <span className="text-white">{user.pName}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeUser;
