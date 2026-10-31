export namespace main {
	
	export class VerificationLookupResult {
	    status: string;
	    code?: string;
	    message: string;
	    reference?: string;
	    retryable: boolean;
	
	    static createFrom(source: any = {}) {
	        return new VerificationLookupResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.status = source["status"];
	        this.code = source["code"];
	        this.message = source["message"];
	        this.reference = source["reference"];
	        this.retryable = source["retryable"];
	    }
	}

}

