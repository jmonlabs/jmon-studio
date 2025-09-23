// src/utils/jmon-validator.js
// Classe de validation et normalisation JMON

import Ajv from 'ajv';
import jmonSchema from '../../schemas/jmon-schema.json' with { type: 'json' };
import { normalizeSamplerUrlsToNoteNames } from './normalize.js';

export class JmonValidator {
    constructor(schema = jmonSchema) {
        this.ajv = new Ajv({ allErrors: true, useDefaults: true });
        this.validate = this.ajv.compile(schema);
    }

    /**
     * Valide et normalise un objet JMON.
     * @param {Object} jmonObj - L'objet JMON à valider.
     * @returns {Object} { valid, errors, normalized }
     */
    validateAndNormalize(jmonObj) {
        // Deep clone pour ne pas modifier l'objet d'origine
        const data = JSON.parse(JSON.stringify(jmonObj));
        // Pre-normalize for schema compliance (e.g., Sampler urls keys to scientific pitch names)
        normalizeSamplerUrlsToNoteNames(data);
        const valid = this.validate(data);
        return {
            valid,
            errors: this.validate.errors || null,
            normalized: valid ? data : null
        };
    }

    /**
     * Utilitaire pour obtenir une version toujours "propre" (valide ou corrigée)
     * @param {Object} jmonObj
     * @returns {Object} normalized JMON (ou null si non réparable)
     */
    getValidJmon(jmonObj) {
        const { valid, normalized } = this.validateAndNormalize(jmonObj);
        return valid ? normalized : null;
    }
}

// Exemple d'utilisation :
// import { JmonValidator } from '../utils/jmon-validator.js';
// const validator = new JmonValidator();
// const { valid, errors, normalized } = validator.validateAndNormalize(jmonObj);
// if (valid) { ...player(normalized)... }
