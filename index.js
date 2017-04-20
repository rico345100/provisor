var promiseCancel = require('promise-cancel');

/**
 * provisor: Promise super visor. Make promise cancelable and give extra functionalities about handling promise handlers with seperate code from yours.
 */
const provisor = {
	namespace: {}
};

/**
 * @param {String} ns: Namespace to add
 * @returns {undefined}
 */
provisor.addNamespace = (ns) => {
	if(!provisor.namespace[ns]) {
		provisor.namespace[ns] = {};
	}

	return;
};

/**
 * @param {String} ns: Namespace to remove
 * @returns {undefined}
 */
provisor.removeNamespace = (ns) => {
	if(provisor.namespace[ns]) {
		delete provisor.namespace[ns];
	}

	return;
}

/**
 * @param {String} ns: Namespace to check
 * @returns {Boolean} Return true if it has
 */
provisor.hasNamespace = (ns) => {
	return !!provisor.namespace[ns];
};

/**
 * @param {String} ns: Namespace to want to save promise
 * @param {String} k: Identifier to lookup provisor's inner table
 * @param {Promise} p: Promise that want to save
 * @param {Object} options: Option object
 * @returns {Promise} New created Promise
 */
provisor.save = (ns, k, p, options) => {
	if(!provisor.namespace[ns]) {
		throw new Error(`Cannot found namespace ${ns} in Provisor`);
	}

	provisor.namespace[ns][k] = promiseCancel(p, options);

	p.then(() => {
		if(provisor.namespace[ns]) {
			delete provisor.namespace[ns][k];
		}
	});

	return provisor.namespace[ns][k].promise;
};

/**
 * @param {String} ns: Namespace
 * @param {String} k: Identifier that want to cancel
 * @returns {undefined}
 */
provisor.cancel = (ns, k) => {
	if(!provisor.namespace[ns]) {
		throw new Error(`Cannot found namespace ${ns} in Provisor`);
	}

	provisor.namespace[ns][k].cancel();
	delete provisor.namespace[ns][k];

	return;
}

/**
 * @param {String} ns: Namespace
 * @returns {undefined}
 */
provisor.cancelAll = (ns) => {
	if(!provisor.namespace[ns]) {
		throw new Error(`Cannot found namespace ${ns} in Provisor`);
	}

	const currentNs = provisor.namespace[ns];

	for(var key in currentNs) {
		provisor.cancel(ns, key);
	}

	return;
}

/**
 * @param {String} ns: Namespace
 * @returns {Object} New object that has same functionalities of provisor, except it's automatically binded specified namespace ns.
 */
provisor.use = (ns) => {
	return {
		save(k, p, o) {
			return provisor.save(ns, k, p, o);
		},
		cancel(k) {
			return provisor.cancel(ns, k);
		},
		cancelAll() {
			return provisor.cancelAll(ns);
		},
		remove() {
			return provisor.removeNamespace(ns);
		}
	};
};

if(process.NODE_ENV !== 'production') {
	global.provisor = provisor;
}

module.exports = provisor;