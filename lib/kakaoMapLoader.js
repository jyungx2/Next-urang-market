// /lib/kakaoMapLoader.js

export function loadKakaoMapScript() {
  const script = document.createElement("script");
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false`;
  script.async = true;
  document.head.appendChild(script);

  return new Promise((resolve) => {
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve(window.kakao);
      });
    };
  });
}
