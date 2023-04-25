exports.joinData = async function (toJoin, joinWith, joinBy) {
    const jointData = joinWith
        .filter((obj1) => joinWith.some((obj2) => obj1[joinBy] === obj2[joinBy]))
        .map((obj1) => ({
            ...obj1,
            ...toJoin.find((obj2) => obj1[joinBy] === obj2[joinBy])
        }));
    return jointData;
}