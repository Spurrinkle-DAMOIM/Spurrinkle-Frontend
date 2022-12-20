import axios from "axios";
import Alert from "sweetalert2";

export const leaderCheck = async (meetName, id) => {
    await axios.get(`/Moim/${meetName}/leader`)
        .then(res => {
            if(res.data !== id) {
                Alert.fire({
                    html: "모임장만 접근 가능한 기능입니다",
                    icon: "warning",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                })
                    .then((res)=>{
                        window.location.href = `/meeting/${meetName}`;
                    });
            }
        })
        .catch(error => console.log(error))
}