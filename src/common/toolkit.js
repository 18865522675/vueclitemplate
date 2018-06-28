import store from '@/store';
import md5 from 'md5';
import bytesJs from './bytes';

const mdMap = "bcdfghjkmpqrtvwxy2346789";

class toolkit {
	UUID() {
		let d = new Date().getTime();
		let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			let r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return(c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	}

	base24Encode(val) {
		if(!val) return val;
		const bytes = bytesJs.fromString(val);
		bytes.reverse();
		let base24Val = "";
		for(let i = bytes.length - 1; i >= 0; i -= 4) {
			let uintArr = new Uint32Array(1),
				v = "";
			for(let j = i < 3 ? i : 3; j >= 0; j--) {
				uintArr[0] = uintArr[0] << 8;
				uintArr[0] += bytes[i - j];
			}
			while(uintArr[0] > 0) {
				v = mdMap[uintArr[0] % 24] + v;
				uintArr[0] /= 24;
			}
			base24Val = `${mdMap[0].repeat(7 - v.length)}${v}${base24Val}`;
		}
		return base24Val;
	}

	base24Decode(val) {
		if(!val) return val;
		const bytes = [];
		let pos = Math.ceil((val.length / 7 + (val.length % 7 == 0 ? 0 : 1)) * 4) - 1;
		const vLength = val.length - 1;
		for(let i = vLength; i >= 0; i -= 7, pos -= 4) {
			let uintArr = new Uint32Array(2);
			for(let j = i < 6 ? i : 6; j >= 0; j--) {
				let d = mdMap.indexOf(val[i - j]);
				if(d == -1) return "";
				uintArr[1] = d;
				uintArr[0] = uintArr[0] * 24 + uintArr[1];
			}
			let t = bytesJs.longToBytes(uintArr[0]);
			for(let j = 0; j < 4; j++) {
				bytes[pos - j] = t[j];
			}
		}
		let byte;
		while(!(byte = bytes[0])) {
			bytes.splice(0, 1);
		}
		bytes.reverse();
		//return bytesJs.byteToString(bytes);//bytes.map(a => String.fromCharCode(a)).join("").replace(/ $/, "");
		return bytesJs.toString(bytes); //bytes.map(a => String.fromCharCode(a)).join("").replace(/ $/, "");
	}

	setCookie(name, value, days) {
		const d = new Date();
		d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
		window.document.cookie = `${name}=${value};path=/;expires=${d.toGMTString()}`;
	};

	getCookie(name) {
		const v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
		return v && v[2];
	};

	deleteCookie(name) {
		this.setCookie(name, "", -1);
	};

	replaceAll(str, oldChar, newChar) {
		return str.replace(new RegExp(oldChar, "gm"), newChar);
	};

	dateFormat(date, fmt) { //author: meizz 
		if(!fmt) return date;

		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

		const rule = {
				"M+": date.getMonth() + 1, //月份 
				"d+": date.getDate(), //日 
				"H+": date.getHours(), //小时 
				"m+": date.getMinutes(), //分 
				"s+": date.getSeconds(), //秒 
				"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
				"f": date.getMilliseconds() //毫秒 
			},
			rk = Object.keys(rule);

		rk.forEach(key => {
			if(!new RegExp("(" + key + ")").test(fmt)) return;
			let str = rule[key] + "";
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? str : (("00" + str).substr(("" + str).length)));
		});

		return fmt;
	};

	format(str, ...args) {
		if(str instanceof Date) {
			return this.dateFormat(str, args[0]);
		}
		if(!/{(\d+)}/gm.test(str)) return str;
		for(let i = 0, len = args.length; i < len; ++i) {
			str = this.replaceAll(str, `{${i}}`, args[i]);
		}
		return str;
	};

	randomNum(min, max) {
		return min + Math.floor(Math.random() * (max - min));
	};

	md5(val) {
		return md5(val);
	};

	closest(el, selector) {
		const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

		while(el && !matchesSelector.call(el, selector)) {
			el = el.parentElement;
		}
		return el;
	};

	serialize(form) {
		const ipts = form.querySelectorAll("[name]"),
			parts = [];
		const closest = this.closest;
		ipts.forEach((v) => {
			if(v.hasAttribute("disabled") && "true,disabled".indexOf(v.attributes.getNamedItem("disabled").value) > -1) return;
			if(closest(v, "div.disabled")) return; //vue组件产生的disabled
			if(v.tagName == "INPUT" && "radio,checkbox".includes(v.type)) {
				v.checked && parts.push(`${v.name}=${v.hasAttribute("value") ? v.value : v.checked}`);
			} else if(v.tagName == "SELECT" && v.type == "select-multiple") {
				Object.values(v.options).forEach((o) => {
					o.selected && parts.push(`${v.name}=${o.value}`);
				});
			} else {
				v.value && parts.push(`${v.name}=${v.value}`);
			}
		});
		return parts.join('&');
	};

	serializeObject(form) {
		const ipts = form.querySelectorAll("[name]"),
			parts = {};
		const closest = this.closest;
		ipts.forEach((v) => {
			if(v.hasAttribute("disabled") && "true,disabled".includes(v.attributes.getNamedItem("disabled").value)) return;
			if(closest(v, "div.disabled")) return; //vue组件产生的disabled
			if(v.tagName == "INPUT" && "radio,checkbox".includes(v.type)) {
				const val = v.hasAttribute("value") ? v.value : v.checked;
				v.checked && (parts[v.name] ? parts[v.name] += val + "," : parts[v.name] = val);
			} else if(v.tagName == "SELECT" && v.type == "select-multiple") {
				Object.values(v.options).forEach((o) => {
					o.selected && (parts[v.name] ? parts[v.name] += o.value + "," : o.value);
				});
			} else {
				v.value && (parts[v.name] = v.value);
			}
		});
		return parts;
	};

	cloneObject(obj) {
		if(obj == null || typeof obj != "object") return obj;
		if(obj instanceof Date) {
			return new Date().setTime(obj.getTime());
		}
		if(obj instanceof Array) {
			return obj.slice();
		}
		if(obj instanceof Object) {
			let c = {};
			Object.keys(obj).forEach(k => c[k] = obj[k]);
			return c;
		}
		return obj;
	};

	downloadFile(url) {
		const elemIF = document.createElement("iframe");
		const form = document.createElement("form");
		elemIF.name = "download";
		elemIF.style.display = "none";
		form.action = url;
		form.method = "post";
		elemIF.appendChild(form);
		document.body.appendChild(elemIF);
		form.submit();
		document.body.removeChild(elemIF);
	};

	convertBase64UrlToBlob(urlData) {
		const bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte  
		//处理异常,将ascii码小于0的转换为大于0  
		const ab = new ArrayBuffer(bytes.length);
		const ia = new Uint8Array(ab);
		for(let i = 0; i < bytes.length; i++) {
			ia[i] = bytes.charCodeAt(i);
		}

		return new Blob([ab], {
			type: 'image/png'
		});
	};

	equals(x, y) {
		if(x === y) {
			return true;
		}
		if(!(x instanceof Object) || !(y instanceof Object)) {
			return false;
		}
		if(x.constructor !== y.constructor) {
			return false;
		}

		for(let p in x) {
			if(x.hasOwnProperty(p)) {
				if(!y.hasOwnProperty(p)) {
					return false;
				}

				if(x[p] === y[p]) {
					continue;
				}

				if(typeof(x[p]) !== "object") {
					return false;
				}

				if(!Object.equals(x[p], y[p])) {
					return false;
				}
			}
		}

		for(let p in y) {
			if(y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
				return false;
			}
		}
		return true;
	};

	GCD(num, deno) {
		while(true) {
			if((num = num % deno) == 0)
				return deno;

			if((deno = deno % num) == 0)
				return num;
		}
	};


//	转化时间戳至2017-01-01的格式
	formattime(time) {
			var timeitem = new Date(time)
			let year = timeitem.getFullYear();
			let month = timeitem.getMonth() + 1;
			let day = timeitem.getDate();
			return year + '-' + this.getdouble(month) + '-' + this.getdouble(day)
	};
		getdouble(value) {
			if(value < 10) {
				return '0' + value
			}
			return value
		}
}
export default new toolkit();