async function checkRole(req, res, next) {
	try {
		const role = req.currentRole;

		// role 체크
		if (role !=='admin') {
			res.status(403).json({
				result: "forbidden-approach",
				reason: "관리자 권한이 있는 사용자만 사용할 수 있는 서비스입니다.",
			});
		}
		next();
	} catch (error) {
		// jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
		// 403 코드로 JSON 형태로 프론트에 전달함.
		res.status(403).json({
			result: "forbidden-approach",
			reason: "접근이 불가능한 페이지입니다.",
		});
	}
}

export { checkRole };
