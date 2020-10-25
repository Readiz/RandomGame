!function(){"use strict";function e(){}function n(e){return e()}function t(){return Object.create(null)}function r(e){e.forEach(n)}function a(e){return"function"==typeof e}function c(e,n){return e!=e?n==n:e!==n||e&&"object"==typeof e||"function"==typeof e}function i(n,t,r){n.$$.on_destroy.push(function(n,...t){if(null==n)return e;const r=n.subscribe(...t);return r.unsubscribe?()=>r.unsubscribe():r}(t,r))}function o(e,n,t=n){return e.set(t),n}function l(e,n){e.appendChild(n)}function u(e,n,t){e.insertBefore(n,t||null)}function s(e){e.parentNode.removeChild(e)}function h(e,n){for(let t=0;t<e.length;t+=1)e[t]&&e[t].d(n)}function d(e){return document.createElement(e)}function f(e){return document.createTextNode(e)}function p(){return f(" ")}function m(){return f("")}function g(e,n,t,r){return e.addEventListener(n,t,r),()=>e.removeEventListener(n,t,r)}function b(e,n,t){null==t?e.removeAttribute(n):e.getAttribute(n)!==t&&e.setAttribute(n,t)}function y(e){return""===e?null:+e}function $(e,n){n=""+n,e.wholeText!==n&&(e.data=n)}function v(e,n){e.value=null==n?"":n}function w(e,n){for(let t=0;t<e.options.length;t+=1){const r=e.options[t];if(r.__value===n)return void(r.selected=!0)}}class k{constructor(e=null){this.a=e,this.e=this.n=null}m(e,n,t=null){this.e||(this.e=d(n.nodeName),this.t=n,this.h(e)),this.i(t)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)u(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(s)}}let x;function N(e){x=e}const T=[],E=[],_=[],O=[],S=Promise.resolve();let C=!1;function M(){C||(C=!0,S.then(I))}function G(e){_.push(e)}let D=!1;const W=new Set;function I(){if(!D){D=!0;do{for(let e=0;e<T.length;e+=1){const n=T[e];N(n),L(n.$$)}for(N(null),T.length=0;E.length;)E.pop()();for(let e=0;e<_.length;e+=1){const n=_[e];W.has(n)||(W.add(n),n())}_.length=0}while(T.length);for(;O.length;)O.pop()();C=!1,D=!1,W.clear()}}function L(e){if(null!==e.fragment){e.update(),r(e.before_update);const n=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,n),e.after_update.forEach(G)}}const A=new Set;let H;function q(){H={r:0,c:[],p:H}}function j(){H.r||r(H.c),H=H.p}function P(e,n){e&&e.i&&(A.delete(e),e.i(n))}function B(e,n,t,r){if(e&&e.o){if(A.has(e))return;A.add(e),H.c.push(()=>{A.delete(e),r&&(t&&e.d(1),r())}),e.o(n)}}function F(e,n){B(e,1,1,()=>{n.delete(e.key)})}function z(e){e&&e.c()}function J(e,t,c){const{fragment:i,on_mount:o,on_destroy:l,after_update:u}=e.$$;i&&i.m(t,c),G(()=>{const t=o.map(n).filter(a);l?l.push(...t):r(t),e.$$.on_mount=[]}),u.forEach(G)}function K(e,n){const t=e.$$;null!==t.fragment&&(r(t.on_destroy),t.fragment&&t.fragment.d(n),t.on_destroy=t.fragment=null,t.ctx=[])}function Q(n,a,c,i,o,l,u=[-1]){const h=x;N(n);const d=a.props||{},f=n.$$={fragment:null,ctx:null,props:l,update:e,not_equal:o,bound:t(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(h?h.$$.context:[]),callbacks:t(),dirty:u,skip_bound:!1};let p=!1;if(f.ctx=c?c(n,d,(e,t,...r)=>{const a=r.length?r[0]:t;return f.ctx&&o(f.ctx[e],f.ctx[e]=a)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](a),p&&function(e,n){-1===e.$$.dirty[0]&&(T.push(e),M(),e.$$.dirty.fill(0)),e.$$.dirty[n/31|0]|=1<<n%31}(n,e)),t}):[],f.update(),p=!0,r(f.before_update),f.fragment=!!i&&i(f.ctx),a.target){if(a.hydrate){const e=function(e){return Array.from(e.childNodes)}(a.target);f.fragment&&f.fragment.l(e),e.forEach(s)}else f.fragment&&f.fragment.c();a.intro&&P(n.$$.fragment),J(n,a.target,a.anchor),I()}N(h)}class R{$destroy(){K(this,1),this.$destroy=e}$on(e,n){const t=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return t.push(n),()=>{const e=t.indexOf(n);-1!==e&&t.splice(e,1)}}$set(e){var n;this.$$set&&(n=e,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const U=[];function V(n,t=e){let r;const a=[];function i(e){if(c(n,e)&&(n=e,r)){const e=!U.length;for(let e=0;e<a.length;e+=1){const t=a[e];t[1](),U.push(t,n)}if(e){for(let e=0;e<U.length;e+=2)U[e][0](U[e+1]);U.length=0}}}return{set:i,update:function(e){i(e(n))},subscribe:function(c,o=e){const l=[c,o];return a.push(l),1===a.length&&(r=t(i)||e),c(n),()=>{const e=a.indexOf(l);-1!==e&&a.splice(e,1),0===a.length&&(r(),r=null)}}}}const X={NotStated:0,Started:1,GameOver:2},Y=V(X.NotStated),Z=V(0),ee=[{id:0,name:"랜덤",desc:"랜덤으로 강화를 시도할 캐릭터를 고릅니다."},{id:1,name:"흑우",desc:"보통의 무기 내구도(3회)와 평범한 운을 가진 캐릭터"},{id:2,name:"주유",desc:"강화 확률이 절반 입니다. 하지만 기본 강화 보장이 높습니다(+5)."},{id:3,name:"태성",desc:"강화시 1%의 확률로 최대 강화에 도달합니다. 하지만 강화에 한번이라도 실패하면 게임오버 입니다."},{id:4,name:"곽철용",desc:"무기 내구도가 2배(6회)입니다. 하지만 기본 강화 보장이 0이며, 강화 확률이 약간 낮습니다."}];function ne(e){let n,t,r,a,c,i;return{c(){n=d("h5"),t=d("b"),r=f("+"),a=f(e[0]),c=p(),i=f(e[3])},m(e,o){u(e,n,o),l(n,t),l(t,r),l(t,a),l(n,c),l(n,i)},p(e,n){1&n&&$(a,e[0]),8&n&&$(i,e[3])},d(e){e&&s(n)}}}function te(e){let n,t;return{c(){n=d("h5"),t=f(e[3])},m(e,r){u(e,n,r),l(n,t)},p(e,n){8&n&&$(t,e[3])},d(e){e&&s(n)}}}function re(n){let t,r,a,c,i,o,h;function f(e,n){return 0===e[0]?te:ne}let g=f(n),y=g(n);return{c(){t=d("div"),r=d("img"),c=p(),i=d("br"),o=p(),y.c(),h=m(),r.src!==(a=n[2])&&b(r,"src",a),b(r,"width",n[1]),b(r,"alt",n[3]),b(t,"class","svelte-1qdcimq")},m(e,n){u(e,t,n),l(t,r),u(e,c,n),u(e,i,n),u(e,o,n),y.m(e,n),u(e,h,n)},p(e,[n]){4&n&&r.src!==(a=e[2])&&b(r,"src",a),2&n&&b(r,"width",e[1]),8&n&&b(r,"alt",e[3]),g===(g=f(e))&&y?y.p(e,n):(y.d(1),y=g(e),y&&(y.c(),y.m(h.parentNode,h)))},i:e,o:e,d(e){e&&s(t),e&&s(c),e&&s(i),e&&s(o),y.d(e),e&&s(h)}}}function ae(e,n,t){let{step:r=0}=n,a=50,c="",i="";return e.$$set=e=>{"step"in e&&t(0,r=e.step)},e.$$.update=()=>{1&e.$$.dirty&&t(1,a=50+5*r),1&e.$$.dirty&&(e=>{switch(e){case 0:case 1:t(2,c="./12.png");break;case 2:case 3:t(2,c="./34.png");break;case 4:case 5:t(2,c="./56.png");break;case 6:case 7:t(2,c="./78.png");break;case 8:case 9:case 10:t(2,c="./90.png")}switch(e){case 0:t(3,i="흔한 검");break;case 1:t(3,i="덜 흔한 검");break;case 2:t(3,i="익숙해진 검");break;case 3:t(3,i="검");break;case 4:t(3,i="일반 검");break;case 5:t(3,i="괜찮은 검");break;case 6:t(3,i="좋은 검");break;case 7:t(3,i="명검");break;case 8:t(3,i="기적의 검");break;case 9:t(3,i="전설의 검");break;case 10:t(3,i="세계관 최강의 검")}})(r)},[r,a,c,i]}class ce extends R{constructor(e){super(),Q(this,e,ae,re,c,{step:0})}}function ie(n){let t,r;return{c(){t=d("span"),r=f(n[0])},m(e,n){u(e,t,n),l(t,r)},p(e,[n]){1&n&&$(r,e[0])},i:e,o:e,d(e){e&&s(t)}}}function oe(e,n,t){let{durability:r=3}=n,a="";return e.$$set=e=>{"durability"in e&&t(1,r=e.durability)},e.$$.update=()=>{2&e.$$.dirty&&(e=>{let n="";for(let t=0;t<e;t++)n+="■";t(0,a=n),0===e&&(n="없음")})(r)},[a,r]}class le extends R{constructor(e){super(),Q(this,e,oe,ie,c,{durability:1})}}function ue(e,n,t){const r=e.slice();return r[14]=n[t],r}function se(e){let n,t,r,a,c,i,o,h=e[0].name+"";return{c(){n=d("b"),t=f(h),r=f("\n        - "),a=f(e[4]),c=p(),i=d("img"),i.src!==(o="./c"+e[0].charType+".png")&&b(i,"src",o),b(i,"width","20"),b(i,"height","20"),b(i,"alt","")},m(e,o){u(e,n,o),l(n,t),u(e,r,o),u(e,a,o),u(e,c,o),u(e,i,o)},p(e,n){1&n&&h!==(h=e[0].name+"")&&$(t,h),16&n&&$(a,e[4]),1&n&&i.src!==(o="./c"+e[0].charType+".png")&&b(i,"src",o)},d(e){e&&s(n),e&&s(r),e&&s(a),e&&s(c),e&&s(i)}}}function he(e){let n,t,r;return{c(){n=d("input")},m(a,c){u(a,n,c),v(n,e[0].name),t||(r=g(n,"input",e[9]),t=!0)},p(e,t){1&t&&n.value!==e[0].name&&v(n,e[0].name)},d(e){e&&s(n),t=!1,r()}}}function de(e){let n,t,r,a,c,i,o,f,m,y=ee,$=[];for(let n=0;n<y.length;n+=1)$[n]=fe(ue(e,y,n));return{c(){n=d("img"),r=p(),a=d("br"),c=p(),i=d("label"),o=d("select");for(let e=0;e<$.length;e+=1)$[e].c();n.src!==(t="./c"+e[0].charType+".png")&&b(n,"src",t),b(n,"width","100"),b(n,"height","100"),b(n,"alt",""),b(o,"class","form-control"),void 0===e[0].charType&&G(()=>e[10].call(o))},m(t,s){u(t,n,s),u(t,r,s),u(t,a,s),u(t,c,s),u(t,i,s),l(i,o);for(let e=0;e<$.length;e+=1)$[e].m(o,null);w(o,e[0].charType),f||(m=g(o,"change",e[10]),f=!0)},p(e,r){if(1&r&&n.src!==(t="./c"+e[0].charType+".png")&&b(n,"src",t),0&r){let n;for(y=ee,n=0;n<y.length;n+=1){const t=ue(e,y,n);$[n]?$[n].p(t,r):($[n]=fe(t),$[n].c(),$[n].m(o,null))}for(;n<$.length;n+=1)$[n].d(1);$.length=y.length}1&r&&w(o,e[0].charType)},d(e){e&&s(n),e&&s(r),e&&s(a),e&&s(c),e&&s(i),h($,e),f=!1,m()}}}function fe(n){let t,r,a,c,i=n[14].name+"";return{c(){t=d("option"),r=f(i),a=p(),t.__value=c=n[14].id,t.value=t.__value},m(e,n){u(e,t,n),l(t,r),l(t,a)},p:e,d(e){e&&s(t)}}}function pe(e){let n,t,r,a,c;n=new ce({props:{step:e[0].weaponEnhance}});let i=e[1]&&e[0].gameOver&&me(e),o=e[1]&&!e[0].gameOver&&ge(e);return{c(){z(n.$$.fragment),t=p(),i&&i.c(),r=p(),o&&o.c(),a=m()},m(e,l){J(n,e,l),u(e,t,l),i&&i.m(e,l),u(e,r,l),o&&o.m(e,l),u(e,a,l),c=!0},p(e,t){const c={};1&t&&(c.step=e[0].weaponEnhance),n.$set(c),e[1]&&e[0].gameOver?i?i.p(e,t):(i=me(e),i.c(),i.m(r.parentNode,r)):i&&(i.d(1),i=null),e[1]&&!e[0].gameOver?o?(o.p(e,t),3&t&&P(o,1)):(o=ge(e),o.c(),P(o,1),o.m(a.parentNode,a)):o&&(q(),B(o,1,1,()=>{o=null}),j())},i(e){c||(P(n.$$.fragment,e),P(o),c=!0)},o(e){B(n.$$.fragment,e),B(o),c=!1},d(e){K(n,e),e&&s(t),i&&i.d(e),e&&s(r),o&&o.d(e),e&&s(a)}}}function me(e){let n,t,r,a,c,i=e[0].enhanceNum+"";return{c(){var e,o,l;n=d("br"),t=d("span"),t.textContent="게임 오버!",r=d("br"),a=f("\n                총 강화 시도 횟수: "),c=f(i),e="color",o="red",t.style.setProperty(e,o,l?"important":"")},m(e,i){u(e,n,i),u(e,t,i),u(e,r,i),u(e,a,i),u(e,c,i)},p(e,n){1&n&&i!==(i=e[0].enhanceNum+"")&&$(c,i)},d(e){e&&s(n),e&&s(t),e&&s(r),e&&s(a),e&&s(c)}}}function ge(e){let n,t,r,a,c,i,o,l,h,g,b,y,v,w=e[0].enhanceWarranty+"";a=new le({props:{durability:e[0].enhanceDurability}});let k=0===e[6]&&be(e);return{c(){n=d("b"),n.textContent="남은 강화 내구도",t=d("br"),r=p(),z(a.$$.fragment),c=p(),i=d("br"),o=p(),l=d("b"),l.textContent="강화 보장",h=f(" +"),g=f(w),b=p(),k&&k.c(),y=m()},m(e,s){u(e,n,s),u(e,t,s),u(e,r,s),J(a,e,s),u(e,c,s),u(e,i,s),u(e,o,s),u(e,l,s),u(e,h,s),u(e,g,s),u(e,b,s),k&&k.m(e,s),u(e,y,s),v=!0},p(e,n){const t={};1&n&&(t.durability=e[0].enhanceDurability),a.$set(t),(!v||1&n)&&w!==(w=e[0].enhanceWarranty+"")&&$(g,w),0===e[6]?k?k.p(e,n):(k=be(e),k.c(),k.m(y.parentNode,y)):k&&(k.d(1),k=null)},i(e){v||(P(a.$$.fragment,e),v=!0)},o(e){B(a.$$.fragment,e),v=!1},d(e){e&&s(n),e&&s(t),e&&s(r),K(a,e),e&&s(c),e&&s(i),e&&s(o),e&&s(l),e&&s(h),e&&s(g),e&&s(b),k&&k.d(e),e&&s(y)}}}function be(e){let n,t,r,a,c,i,o,h;function f(e,n){return e[0].enhanceWarranty>e[0].weaponEnhance?$e:ye}let m=f(e),y=m(e);return{c(){n=d("br"),t=p(),r=d("div"),a=d("b"),a.textContent="강화 도전!!!",c=d("br"),i=p(),y.c(),b(r,"class","btn btn-lg btn-warning")},m(s,d){u(s,n,d),u(s,t,d),u(s,r,d),l(r,a),l(r,c),l(r,i),y.m(r,null),o||(h=g(r,"click",e[7]),o=!0)},p(e,n){m===(m=f(e))&&y?y.p(e,n):(y.d(1),y=m(e),y&&(y.c(),y.m(r,null)))},d(e){e&&s(n),e&&s(t),e&&s(r),y.d(),o=!1,h()}}}function ye(e){let n,t,r,a,c=Math.round(100*e[2])+"";return{c(){n=d("small"),t=f("성공확률: "),r=f(c),a=f("%")},m(e,c){u(e,n,c),l(n,t),l(n,r),l(n,a)},p(e,n){4&n&&c!==(c=Math.round(100*e[2])+"")&&$(r,c)},d(e){e&&s(n)}}}function $e(n){let t;return{c(){t=d("small"),t.textContent="강화 보장 구간"},m(e,n){u(e,t,n)},p:e,d(e){e&&s(t)}}}function ve(e){let n,t,r,a,c,i,o;function h(e,n){return e[1]?se:he}let f=h(e),m=f(e),g=!e[1]&&de(e),y=e[1]&&pe(e);return{c(){n=d("div"),m.c(),t=p(),r=d("hr"),a=p(),g&&g.c(),c=p(),y&&y.c(),b(n,"class","playerContainer svelte-1vko929"),b(n,"recentstate",e[3]),b(n,"isautoplaying",i=e[6]>0&&e[1]&&!e[0].gameOver)},m(i,s){u(i,n,s),m.m(n,null),l(n,t),l(n,r),l(n,a),g&&g.m(n,null),l(n,c),y&&y.m(n,null),e[11](n),o=!0},p(e,[r]){f===(f=h(e))&&m?m.p(e,r):(m.d(1),m=f(e),m&&(m.c(),m.m(n,t))),e[1]?g&&(g.d(1),g=null):g?g.p(e,r):(g=de(e),g.c(),g.m(n,c)),e[1]?y?(y.p(e,r),2&r&&P(y,1)):(y=pe(e),y.c(),P(y,1),y.m(n,null)):y&&(q(),B(y,1,1,()=>{y=null}),j()),(!o||8&r)&&b(n,"recentstate",e[3]),(!o||67&r&&i!==(i=e[6]>0&&e[1]&&!e[0].gameOver))&&b(n,"isautoplaying",i)},i(e){o||(P(y),o=!0)},o(e){B(y),o=!1},d(t){t&&s(n),m.d(),g&&g.d(),y&&y.d(),e[11](null)}}}function we(e,n){return Math.floor(Math.random()*(n-e+1)+e)}function ke(e,n,t){let r;i(e,Z,e=>t(6,r=e));let{playerInfo:a={uid:0,id:0,name:"",charType:0,enhanceDurability:3,enhanceWarranty:3,enhanceNum:0,weaponEnhance:0,highlight:!1,gameOver:!1}}=n,{handleGameOver:c=(()=>{})}=n,{isGameStarted:o=!1}=n,l=1;const u="Failed",s="BigFailed",h="Success",d="NothingHappened";let f,p=d,m="";function g(){if(a.gameOver)t(3,p=d);else{if(t(0,a.enhanceNum++,a),a.weaponEnhance<a.enhanceWarranty||we(1,100)<100*l){if(t(3,p=h),t(0,a.weaponEnhance++,a),10===a.weaponEnhance)return t(3,p=d),void t(0,a.gameOver=!0,a)}else if(t(3,p=u),t(0,a.enhanceDurability-=1,a),we(1,100)<=30&&a.weaponEnhance>0&&(t(3,p=s),t(0,a.weaponEnhance-=1,a)),0===a.enhanceDurability)return t(3,p=d),void t(0,a.gameOver=!0,a);if(3===a.charType&&we(1,100)<=1)return t(3,p=d),t(0,a.weaponEnhance=10,a),void t(0,a.gameOver=!0,a);t(2,l=1-.1*a.weaponEnhance),2===a.charType?t(2,l*=.5):4===a.charType&&t(2,l*=.8)}}return Y.subscribe(e=>{e===X.Started&&function(){0===a.charType&&t(0,a.charType=we(1,4),a);2===a.charType&&(t(0,a.enhanceWarranty=5,a),t(2,l=.5));3===a.charType&&t(0,a.enhanceDurability=1,a);4===a.charType&&(t(0,a.enhanceDurability=6,a),t(0,a.enhanceWarranty=0,a),t(2,l=.8))}()}),Z.subscribe(e=>{o&&g()}),e.$$set=e=>{"playerInfo"in e&&t(0,a=e.playerInfo),"handleGameOver"in e&&t(8,c=e.handleGameOver),"isGameStarted"in e&&t(1,o=e.isGameStarted)},e.$$.update=()=>{1&e.$$.dirty&&t(4,m=ee[a.charType].name),257&e.$$.dirty&&a.gameOver&&c()},[a,o,l,p,m,f,r,g,c,function(){a.name=this.value,t(0,a)},function(){a.charType=function(e){const n=e.querySelector(":checked")||e.options[0];return n&&n.__value}(this),t(0,a)},function(e){E[e?"unshift":"push"](()=>{f=e,t(5,f)})}]}class xe extends R{constructor(e){super(),Q(this,e,ke,ve,c,{playerInfo:0,handleGameOver:8,isGameStarted:1})}}function Ne(e,n,t){const r=e.slice();return r[17]=n[t],r}function Te(e,n,t){const r=e.slice();return r[20]=n[t],r}function Ee(e){let n,t,a,c,i,o,h,m,$,w,k,x,N,T,E;return{c(){n=d("label"),t=f("게임 인원 수:\r\n\t"),a=d("input"),c=p(),i=d("input"),o=p(),h=d("br"),m=p(),$=d("label"),w=f("우승 등수:\r\n\t"),k=d("input"),x=p(),N=d("input"),b(a,"type","number"),b(a,"min","1"),b(a,"max","10"),b(i,"type","range"),b(i,"min","1"),b(i,"max","10"),b(k,"type","number"),b(k,"min","1"),b(k,"max",e[2]),b(N,"type","range"),b(N,"min","1"),b(N,"max",e[2])},m(r,s){u(r,n,s),l(n,t),l(n,a),v(a,e[2]),l(n,c),l(n,i),v(i,e[2]),u(r,o,s),u(r,h,s),u(r,m,s),u(r,$,s),l($,w),l($,k),v(k,e[3]),l($,x),l($,N),v(N,e[3]),T||(E=[g(a,"input",e[9]),g(i,"change",e[10]),g(i,"input",e[10]),g(k,"input",e[11]),g(N,"change",e[12]),g(N,"input",e[12])],T=!0)},p(e,n){4&n&&y(a.value)!==e[2]&&v(a,e[2]),4&n&&v(i,e[2]),4&n&&b(k,"max",e[2]),8&n&&y(k.value)!==e[3]&&v(k,e[3]),4&n&&b(N,"max",e[2]),8&n&&v(N,e[3])},d(e){e&&s(n),e&&s(o),e&&s(h),e&&s(m),e&&s($),T=!1,r(E)}}}function _e(e,n){let t,r,a;return r=new xe({props:{playerInfo:n[20],isGameStarted:n[0],handleGameOver:n[8]}}),{key:e,first:null,c(){t=m(),z(r.$$.fragment),this.first=t},m(e,n){u(e,t,n),J(r,e,n),a=!0},p(e,n){const t={};16&n&&(t.playerInfo=e[20]),1&n&&(t.isGameStarted=e[0]),r.$set(t)},i(e){a||(P(r.$$.fragment,e),a=!0)},o(e){B(r.$$.fragment,e),a=!1},d(e){e&&s(t),K(r,e)}}}function Oe(n){let t,r,a;return{c(){t=d("div"),t.textContent="게임 시작!",b(t,"class","btn btn-md btn-primary")},m(e,c){u(e,t,c),r||(a=g(t,"click",n[13]),r=!0)},p:e,d(e){e&&s(t),r=!1,a()}}}function Se(n){let t,r,a;return{c(){t=d("div"),t.innerHTML="<h1>게임 자동 진행</h1>",b(t,"class","btn btn-lg btn-info")},m(e,c){u(e,t,c),r||(a=g(t,"click",n[14]),r=!0)},p:e,d(e){e&&s(t),r=!1,a()}}}function Ce(e){let n,t,r,a,c;return{c(){t=p(),r=d("div"),r.textContent="게임 재시작",n=new k(t),b(r,"class","btn btn-md btn-danger")},m(i,o){n.m(e[5],i,o),u(i,t,o),u(i,r,o),a||(c=g(r,"click",e[15]),a=!0)},p(e,t){32&t&&n.p(e[5])},d(e){e&&n.d(),e&&s(t),e&&s(r),a=!1,c()}}}function Me(e){let n,t,r,a,c,i,o,l=ee,f=[];for(let n=0;n<l.length;n+=1)f[n]=Ge(Ne(e,l,n));return{c(){n=d("h3"),n.textContent="튜토리얼",t=p(),r=d("ol"),r.innerHTML="<li>게임이 사직되면, 각 플레이어는 각 플레이어의 특성에 맞는 스탯을 부여 받습니다.</li> \n  <li>무기 강화를 시도하게 되면, 강화도가 1 상승하거나, 유지되거나, 하락할 수 있습니다.</li> \n  <li>각 플레이어는 무기의 내구도가 모두 소모될 때까지 강화를 계속 시도 해야 합니다.</li> \n  <li>모든 플레이어의 강화가 끝나면, 처음에 설정한 순위의 사람이 당첨 되게 됩니다.</li> \n  <li>순위는 무기 강화도가 높은 사람이 높으며, 동점인 경우 시도 횟수가 적은 사람이 높습니다.</li> \n  <li>게임이 시작되면 자동 진행을 할 수 있으며, 자동진행을 하게 되면 모든 플레이어의 강화가 끝날 때까지 게임이 지속 됩니다.</li>",a=p(),c=d("h4"),c.textContent="캐릭터 특성 설명",i=p(),o=d("ul");for(let e=0;e<f.length;e+=1)f[e].c()},m(e,l){u(e,n,l),u(e,t,l),u(e,r,l),u(e,a,l),u(e,c,l),u(e,i,l),u(e,o,l);for(let e=0;e<f.length;e+=1)f[e].m(o,null)},p(e,n){if(0&n){let t;for(l=ee,t=0;t<l.length;t+=1){const r=Ne(e,l,t);f[t]?f[t].p(r,n):(f[t]=Ge(r),f[t].c(),f[t].m(o,null))}for(;t<f.length;t+=1)f[t].d(1);f.length=l.length}},d(e){e&&s(n),e&&s(t),e&&s(r),e&&s(a),e&&s(c),e&&s(i),e&&s(o),h(f,e)}}}function Ge(n){let t,r,a,c,i=n[17].name+"",o=n[17].desc+"";return{c(){t=d("li"),r=f(i),a=f(": "),c=f(o)},m(e,n){u(e,t,n),l(t,r),l(t,a),l(t,c)},p:e,d(e){e&&s(t)}}}function De(e){let n,t,r,a,c,i,o,l,h,f,g,b,y,$,v,w=[],k=new Map,x=!e[0]&&Ee(e),N=e[4];const T=e=>e[20].uid;for(let n=0;n<N.length;n+=1){let t=Te(e,N,n),r=T(t);k.set(r,w[n]=_e(r,t))}let E=!e[0]&&Oe(e),_=e[0]&&!e[1]&&!e[7]&&Se(e),O=e[1]&&Ce(e),S=!e[0]&&Me(e);return{c(){n=d("h1"),n.textContent="운빨망겜",t=p(),r=d("p"),r.innerHTML="당신의 운을 시험해서 승자가 되세요.<br/>\n무기를 강화해 보세요!",a=p(),x&&x.c(),c=p(),i=d("div");for(let e=0;e<w.length;e+=1)w[e].c();o=p(),E&&E.c(),l=p(),_&&_.c(),h=p(),O&&O.c(),f=p(),g=d("br"),b=d("br"),y=p(),S&&S.c(),$=m()},m(e,s){u(e,n,s),u(e,t,s),u(e,r,s),u(e,a,s),x&&x.m(e,s),u(e,c,s),u(e,i,s);for(let e=0;e<w.length;e+=1)w[e].m(i,null);u(e,o,s),E&&E.m(e,s),u(e,l,s),_&&_.m(e,s),u(e,h,s),O&&O.m(e,s),u(e,f,s),u(e,g,s),u(e,b,s),u(e,y,s),S&&S.m(e,s),u(e,$,s),v=!0},p(e,[n]){if(e[0]?x&&(x.d(1),x=null):x?x.p(e,n):(x=Ee(e),x.c(),x.m(c.parentNode,c)),273&n){const t=e[4];q(),w=function(e,n,t,r,a,c,i,o,l,u,s,h){let d=e.length,f=c.length,p=d;const m={};for(;p--;)m[e[p].key]=p;const g=[],b=new Map,y=new Map;for(p=f;p--;){const e=h(a,c,p),o=t(e);let l=i.get(o);l?r&&l.p(e,n):(l=u(o,e),l.c()),b.set(o,g[p]=l),o in m&&y.set(o,Math.abs(p-m[o]))}const $=new Set,v=new Set;function w(e){P(e,1),e.m(o,s),i.set(e.key,e),s=e.first,f--}for(;d&&f;){const n=g[f-1],t=e[d-1],r=n.key,a=t.key;n===t?(s=n.first,d--,f--):b.has(a)?!i.has(r)||$.has(r)?w(n):v.has(a)?d--:y.get(r)>y.get(a)?(v.add(r),w(n)):($.add(a),d--):(l(t,i),d--)}for(;d--;){const n=e[d];b.has(n.key)||l(n,i)}for(;f;)w(g[f-1]);return g}(w,n,T,1,e,t,k,i,F,_e,null,Te),j()}e[0]?E&&(E.d(1),E=null):E?E.p(e,n):(E=Oe(e),E.c(),E.m(l.parentNode,l)),!e[0]||e[1]||e[7]?_&&(_.d(1),_=null):_?_.p(e,n):(_=Se(e),_.c(),_.m(h.parentNode,h)),e[1]?O?O.p(e,n):(O=Ce(e),O.c(),O.m(f.parentNode,f)):O&&(O.d(1),O=null),e[0]?S&&(S.d(1),S=null):S?S.p(e,n):(S=Me(e),S.c(),S.m($.parentNode,$))},i(e){if(!v){for(let e=0;e<N.length;e+=1)P(w[e]);v=!0}},o(e){for(let e=0;e<w.length;e+=1)B(w[e]);v=!1},d(e){e&&s(n),e&&s(t),e&&s(r),e&&s(a),x&&x.d(e),e&&s(c),e&&s(i);for(let e=0;e<w.length;e+=1)w[e].d();e&&s(o),E&&E.d(e),e&&s(l),_&&_.d(e),e&&s(h),O&&O.d(e),e&&s(f),e&&s(g),e&&s(b),e&&s(y),S&&S.d(e),e&&s($)}}}function We(e,n){return e.weaponEnhance>n.weaponEnhance?-1:e.weaponEnhance<n.weaponEnhance||e.enhanceNum>n.enhanceNum?1:e.enhanceNum<n.enhanceNum?-1:0}function Ie(e){return new Promise(n=>setTimeout(n,e))}function Le(e,n,t){let r,a;i(e,Y,e=>t(6,r=e)),i(e,Z,e=>t(7,a=e));let c=!1,l=!1,u=4,s=4,h=0,d=[{uid:-1,id:1,name:"",charType:0,enhanceDurability:3,enhanceWarranty:3,enhanceNum:0,weaponEnhance:0,highlight:!1,gameOver:!1},{uid:-1,id:2,name:"",charType:0,enhanceDurability:3,enhanceWarranty:3,enhanceNum:0,weaponEnhance:0,highlight:!1,gameOver:!1}],f="";return e.$$.update=()=>{65564&e.$$.dirty&&(e=>{t(4,d=[]);for(let n=0;n<e;n++)d.push({uid:h,id:n+1,name:"플레이어 #"+(n+1),charType:0,enhanceDurability:3,enhanceWarranty:3,enhanceNum:0,weaponEnhance:0,highlight:!1,gameOver:!1}),t(16,h++,h);s>e&&t(3,s=e)})(u)},[c,l,u,s,d,f,r,a,function(){let e=!0;for(const n of d)!1===n.gameOver&&(e=!1);if(e){t(1,l=!0);let e,n=1;t(5,f="");for(const r of d.sort(We))n===s&&(e=r.name),t(5,f+=`<hr><b>${n}등: ${r.name} 님</b><br>`),t(5,f+=`무기강화 결과: ${r.weaponEnhance}강 / `),t(5,f+=`총 강화 시도 횟수: ${r.enhanceNum}회`),n++;t(5,f+=`<br><hr><h4>${e} 님, ${s}등 축하드립니다.</h4>`),t(5,f+="기분 좋은 마음으로 커피를 쏘면 어떨까요?<br>")}},function(){u=y(this.value),t(2,u)},function(){u=y(this.value),t(2,u)},function(){s=y(this.value),t(3,s),t(4,d),t(16,h),t(2,u)},function(){s=y(this.value),t(3,s),t(4,d),t(16,h),t(2,u)},()=>{t(0,c=!0),o(Y,r=X.Started,r)},()=>{(async()=>{for(;!l;)o(Z,a+=1,a),await(M(),S),await Ie(400)})()},()=>{t(1,l=!1),t(0,c=!1),o(Y,r=X.NotStarted,r),o(Z,a=0,a),t(4,d=[]),t(2,u=4)}]}new class extends R{constructor(e){super(),Q(this,e,Le,De,c,{})}}({target:document.body})}();
//# sourceMappingURL=index.js.map
