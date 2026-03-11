"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type TipoRequerente = "proprioContribuinte" | "procurador" | "compromissario";

type PossuiProcessos = "nao" | "sim";

type UtilizacaoImovel =
  | "residencial"
  | "naoResidencial"
  | "misto"
  | "naoEdificado"
  | "emRuinas";

type MotivoErro = "areaConstruida" | "erroCalculo" | "outros";

type FormState = {
  nomeSujeitoPassivo: string;
  cpfCnpjSujeito: string;
  documentoIdentidadeSujeito: string;
  enderecoSujeito: string;
  numeroSujeito: string;
  complementoSujeito: string;
  bairroSujeito: string;
  cepSujeito: string;
  cidadeUfSujeito: string;
  whatsappSujeito: string;
  emailSujeito: string;
  telefoneSujeito: string;

  tipoRequerente: TipoRequerente;
  nomeRequerenteCompleto: string;
  cpfRequerente: string;
  enderecoRequerenteRua: string;
  enderecoRequerenteNumero: string;
  enderecoRequerenteComplemento: string;
  enderecoRequerenteBairro: string;
  enderecoRequerenteCep: string;
  enderecoRequerenteCidadeUf: string;
  telefoneWhatsappRequerente: string;
  emailRequerente: string;

  inscricaoImobiliaria: string;
  enderecoImovel: string;
  numeroImovel: string;
  complementoImovel: string;
  bairroImovel: string;
  cepImovel: string;
  cidadeUfImovel: string;
  distritoImovel: string;

  anoTaxaLixo: string;
  valorTaxaCobrada: string;
  valorCorreto: string;
  possuiProcessos: PossuiProcessos;
  numerosProcessos: string;
  utilizacaoImovel: UtilizacaoImovel;
  motivoErro: MotivoErro[];
  motivacaoPedido: string;
};

const initialState: FormState = {
  nomeSujeitoPassivo: "",
  cpfCnpjSujeito: "",
  documentoIdentidadeSujeito: "",
  enderecoSujeito: "",
  numeroSujeito: "",
  complementoSujeito: "",
  bairroSujeito: "",
  cepSujeito: "",
  cidadeUfSujeito: "",
  whatsappSujeito: "",
  emailSujeito: "",
  telefoneSujeito: "",

  tipoRequerente: "proprioContribuinte",
  nomeRequerenteCompleto: "",
  cpfRequerente: "",
  enderecoRequerenteRua: "",
  enderecoRequerenteNumero: "",
  enderecoRequerenteComplemento: "",
  enderecoRequerenteBairro: "",
  enderecoRequerenteCep: "",
  enderecoRequerenteCidadeUf: "",
  telefoneWhatsappRequerente: "",
  emailRequerente: "",

  inscricaoImobiliaria: "",
  enderecoImovel: "",
  numeroImovel: "",
  complementoImovel: "",
  bairroImovel: "",
  cepImovel: "",
  cidadeUfImovel: "Porto Velho/RO",
  distritoImovel: "",

  anoTaxaLixo: "",
  valorTaxaCobrada: "",
  valorCorreto: "",
  possuiProcessos: "nao",
  numerosProcessos: "",
  utilizacaoImovel: "residencial",
  motivoErro: [],
  motivacaoPedido: "",
};

const motivoErroLabels: Record<MotivoErro, string> = {
  areaConstruida: "ÁREA CONSTRUÍDA",
  erroCalculo: "ERRO DE CÁLCULO",
  outros: "OUTROS (DESCREVA NO CAMPO ABAIXO)",
};

const tipoRequerenteLabels: Record<TipoRequerente, string> = {
  proprioContribuinte:
    "O PRÓPRIO CONTRIBUINTE (NÃO É NECESSÁRIO PREENCHER OS DADOS REPETIDOS)",
  procurador: "PROCURADOR OU REPRESENTANTE LEGAL",
  compromissario: "COMPROMISSÁRIO/POSSEIRO (COMPROU O IMÓVEL MAS NÃO AVERBOU)",
};

const possuiProcessosLabels: Record<PossuiProcessos, string> = {
  nao: "NÃO",
  sim: "SIM",
};

const utilizacaoImovelLabels: Record<UtilizacaoImovel, string> = {
  residencial: "RESIDENCIAL",
  naoResidencial: "NÃO RESIDENCIAL",
  misto: "MISTO",
  naoEdificado: "NÃO EDIFICADO",
  emRuinas: "EM RUÍNAS",
};

function SectionCard({
  title,
  children,
  muted = false,
}: {
  title: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      className={`mb-8 overflow-hidden rounded-lg border border-gray-200 ${
        muted ? "bg-[#f5f5f5]" : "bg-white"
      }`}
    >
      <h5
        className={`px-4 py-2 text-sm font-bold md:text-base ${
          muted ? "bg-gray-200 text-[#1e3a5f]" : "bg-[#f5f5f5] text-[#1e3a5f]"
        }`}
      >
        {title}
      </h5>
      {children}
    </section>
  );
}

function InputField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly = false,
  invalid = false,
  className = "",
  inputClassName = "",
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  invalid?: boolean;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`mb-1 block text-sm font-semibold ${
          invalid ? "text-red-700" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        maxLength={maxLength}
        className={`w-full rounded border px-3 py-2 text-sm outline-none transition ${
          readOnly ? "cursor-not-allowed bg-gray-100" : "bg-white"
        } ${
          invalid
            ? "border-red-400 bg-red-50"
            : "border-gray-300 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
        } ${inputClassName}`}
      />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  invalid = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`mb-1 block text-sm font-semibold ${
          invalid ? "text-red-700" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        rows={6}
        placeholder={placeholder}
        className={`w-full rounded border px-3 py-2 text-sm outline-none transition ${
          invalid
            ? "border-red-400 bg-red-50"
            : "border-gray-300 bg-white focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10"
        }`}
      />
    </div>
  );
}

function splitLongText(text: string, maxLength = 1800) {
  const clean = text.trim();
  if (!clean) return [""];

  const paragraphs = clean.split(/\n+/).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (candidate.length <= maxLength) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
      current = "";
    }

    if (paragraph.length <= maxLength) {
      current = paragraph;
      continue;
    }

    for (let i = 0; i < paragraph.length; i += maxLength) {
      chunks.push(paragraph.slice(i, i + maxLength));
    }
  }

  if (current) chunks.push(current);

  return chunks.length ? chunks : [""];
}

function parseCurrencyBR(value: string) {
  const normalized = value
    .replace(/\s/g, "")
    .replace(/R\$/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const cents = parseInt(digits, 10);
  const reais = (cents / 100).toFixed(2);
  const [intPart, decPart] = reais.split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formattedInt},${decPart}`;
}

function formatCurrencyBR(value: number | null) {
  if (value === null) return "-";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDateExtenso(date: Date) {
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  return `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhoneBR(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function isValidCpfLength(value: string) {
  return digitsOnly(value).length === 11;
}

function isValidCpfCnpjLength(value: string) {
  const len = digitsOnly(value).length;
  return len === 11 || len === 14;
}

function isValidCep(value: string) {
  return digitsOnly(value).length === 8;
}

function isValidPhoneBR(value: string) {
  const len = digitsOnly(value).length;
  return len === 10 || len === 11;
}

function isValidYear(value: string) {
  if (!/^\d{4}$/.test(value.trim())) return false;

  const year = Number(value);
  const currentYear = new Date().getFullYear();

  return year >= 1900 && year <= currentYear + 1;
}

function isValidCurrencyValue(value: string) {
  const parsed = parseCurrencyBR(value);
  return parsed !== null && parsed >= 0;
}

function hasOnlyDigits(value: string) {
  return /^\d+$/.test(value.trim());
}

function hasValidProcessFormat(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;

  return /^[0-9\s./-]+$/.test(trimmed) && /\d/.test(trimmed);
}

function getPdfGeneratedDateLabel() {
  return new Intl.DateTimeFormat("pt-BR").format(new Date());
}

export default function ImpugnacaoForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [invalidGroups, setInvalidGroups] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const signatureName =
    form.tipoRequerente === "proprioContribuinte"
      ? form.nomeSujeitoPassivo
      : form.nomeRequerenteCompleto || form.nomeSujeitoPassivo;

  const signatureCpf =
    form.tipoRequerente === "proprioContribuinte"
      ? form.cpfCnpjSujeito
      : form.cpfRequerente || form.cpfCnpjSujeito;

  const differenceValue = (() => {
    const cobrado = parseCurrencyBR(form.valorTaxaCobrada);
    const correto = parseCurrencyBR(form.valorCorreto);
    if (cobrado === null || correto === null) return null;
    return cobrado - correto;
  })();

  const motivacaoChunks = splitLongText(form.motivacaoPedido, 1800);

  const currentDate = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date());
  }, []);

  function isInvalidField(field: string) {
    return invalidFields.includes(field);
  }

  function isInvalidGroup(group: string) {
    return invalidGroups.includes(group);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCpfCnpjChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name } = e.target;
    const formatted = formatCpfCnpj(e.target.value);
    setForm((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  }

  function handleCurrencyChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name } = e.target;
    const formatted = formatCurrencyInput(e.target.value);
    setForm((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  }

  function handlePhoneChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name } = e.target;
    const formatted = formatPhoneBR(e.target.value);
    setForm((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  }

  function handleRadioChange<T extends keyof FormState>(
    field: T,
    value: FormState[T],
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleCheckboxChange(value: MotivoErro) {
    setForm((prev) => {
      const exists = prev.motivoErro.includes(value);
      return {
        ...prev,
        motivoErro: exists
          ? prev.motivoErro.filter((item) => item !== value)
          : [...prev.motivoErro, value],
      };
    });
  }

  function scrollToFirstError(fieldIds: string[], groupIds: string[]) {
    const first = fieldIds[0] ?? groupIds[0];
    if (!first) return;

    const el = document.getElementById(first);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      if ("focus" in el && typeof el.focus === "function") {
        (el as HTMLElement).focus();
      }
    }
  }

  function validateForm() {
    const errors: string[] = [];
    const fields: string[] = [];
    const groups: string[] = [];

    const emailRegex = /^\S+@\S+\.\S+$/;

    function addFieldError(field: keyof FormState | string, message: string) {
      errors.push(message);
      fields.push(String(field));
    }

    function required(field: keyof FormState, label: string) {
      const value = form[field];
      if (typeof value === "string" && value.trim() === "") {
        addFieldError(field, `O campo "${label}" é obrigatório.`);
      }
    }

    function validateEmail(field: keyof FormState, label: string) {
      const value = form[field];
      if (
        typeof value === "string" &&
        value.trim() !== "" &&
        !emailRegex.test(value.trim())
      ) {
        addFieldError(field, `"${label}" não é um e-mail válido.`);
      }
    }

    function validateCpfCnpj(field: keyof FormState, label: string) {
      const value = String(form[field] ?? "").trim();
      if (!value) return;

      if (!isValidCpfCnpjLength(value)) {
        addFieldError(
          field,
          `"${label}" deve conter 11 dígitos (CPF) ou 14 dígitos (CNPJ).`,
        );
      }
    }

    function validateCpf(field: keyof FormState, label: string) {
      const value = String(form[field] ?? "").trim();
      if (!value) return;

      if (!isValidCpfLength(value)) {
        addFieldError(field, `"${label}" deve conter 11 dígitos.`);
      }
    }

    function normalizeDocumentoIdentidade(value: string) {
      return value.trim().toUpperCase();
    }

    function isValidRgAntigo(value: string) {
      const normalized = normalizeDocumentoIdentidade(value);

      if (!/^[0-9A-Z.\-\s]+$/.test(normalized)) return false;

      const compact = normalized.replace(/[^0-9A-Z]/g, "");

      return compact.length >= 5 && compact.length <= 14;
    }

    function isValidDocumentoIdentidade(value: string) {
      const digits = digitsOnly(value);

      if (digits.length === 11) return true;

      return isValidRgAntigo(value);
    }

    function validateDocumentoIdentidade(
      field: keyof FormState,
      label: string,
    ) {
      const value = String(form[field] ?? "").trim();
      if (!value) return;

      if (!isValidDocumentoIdentidade(value)) {
        addFieldError(
          field,
          `"${label}" deve ser um RG antigo válido ou um CPF com 11 dígitos.`,
        );
      }
    }

    function validateCepField(field: keyof FormState, label: string) {
      const value = String(form[field] ?? "").trim();
      if (!value) return;

      if (!isValidCep(value)) {
        addFieldError(field, `"${label}" deve conter 8 dígitos.`);
      }
    }

    function validatePhoneField(
      field: keyof FormState,
      label: string,
      optional = false,
    ) {
      const value = String(form[field] ?? "").trim();

      if (!value) {
        if (!optional) {
          addFieldError(field, `O campo "${label}" é obrigatório.`);
        }
        return;
      }

      if (!isValidPhoneBR(value)) {
        addFieldError(field, `"${label}" deve conter 10 ou 11 dígitos.`);
      }
    }

    function validateNumericOnlyField(
      field: keyof FormState,
      label: string,
      options?: {
        exactLength?: number;
        minLength?: number;
        maxLength?: number;
      },
    ) {
      const value = String(form[field] ?? "").trim();
      if (!value) return;

      if (!hasOnlyDigits(value)) {
        addFieldError(field, `"${label}" deve conter apenas números.`);
        return;
      }

      if (
        options?.exactLength !== undefined &&
        value.length !== options.exactLength
      ) {
        addFieldError(
          field,
          `"${label}" deve conter exatamente ${options.exactLength} dígitos.`,
        );
        return;
      }

      if (
        options?.minLength !== undefined &&
        value.length < options.minLength
      ) {
        addFieldError(
          field,
          `"${label}" deve conter no mínimo ${options.minLength} dígitos.`,
        );
        return;
      }

      if (
        options?.maxLength !== undefined &&
        value.length > options.maxLength
      ) {
        addFieldError(
          field,
          `"${label}" deve conter no máximo ${options.maxLength} dígitos.`,
        );
      }
    }

    function validateYearField(field: keyof FormState, label: string) {
      const value = String(form[field] ?? "").trim();
      if (!value) return;

      if (!isValidYear(value)) {
        addFieldError(
          field,
          `"${label}" deve ser um ano válido com 4 dígitos.`,
        );
      }
    }

    function validateCurrencyField(field: keyof FormState, label: string) {
      const value = String(form[field] ?? "").trim();
      if (!value) return;

      if (!isValidCurrencyValue(value)) {
        addFieldError(
          field,
          `"${label}" deve ser um valor monetário válido. Ex.: 150,00`,
        );
      }
    }

    // CAMPO I
    required("nomeSujeitoPassivo", "NOME / RAZÃO SOCIAL (Sujeito Passivo)");
    required("cpfCnpjSujeito", "CPF / CNPJ (Sujeito Passivo)");
    required(
      "documentoIdentidadeSujeito",
      "DOCUMENTO DE IDENTIDADE (Sujeito Passivo)",
    );
    required("enderecoSujeito", "ENDEREÇO (Sujeito Passivo)");
    required("numeroSujeito", "Nº (Sujeito Passivo)");
    required("bairroSujeito", "BAIRRO (Sujeito Passivo)");
    required("cepSujeito", "CEP (Sujeito Passivo)");
    required("cidadeUfSujeito", "CIDADE / UF (Sujeito Passivo)");
    required("whatsappSujeito", "WHATSAPP COM DDD (Sujeito Passivo)");
    required("emailSujeito", "E-MAIL (Sujeito Passivo)");

    validateCpfCnpj("cpfCnpjSujeito", "CPF / CNPJ (Sujeito Passivo)");
    validateDocumentoIdentidade(
      "documentoIdentidadeSujeito",
      "DOCUMENTO DE IDENTIDADE (Sujeito Passivo)",
    );
    validateCepField("cepSujeito", "CEP (Sujeito Passivo)");
    validatePhoneField("whatsappSujeito", "WHATSAPP COM DDD (Sujeito Passivo)");
    validatePhoneField(
      "telefoneSujeito",
      "TELEFONE COM DDD (Sujeito Passivo)",
      true,
    );
    validateEmail("emailSujeito", "E-MAIL (Sujeito Passivo)");

    // CAMPO II
    if (form.tipoRequerente !== "proprioContribuinte") {
      required("nomeRequerenteCompleto", "NOME COMPLETO (Requerente)");
      required("cpfRequerente", "CPF (Requerente)");
      required("enderecoRequerenteRua", "ENDEREÇO (Requerente)");
      required("enderecoRequerenteNumero", "Nº (Requerente)");
      required("enderecoRequerenteBairro", "BAIRRO (Requerente)");
      required("enderecoRequerenteCep", "CEP (Requerente)");
      required("enderecoRequerenteCidadeUf", "CIDADE / UF (Requerente)");
      required(
        "telefoneWhatsappRequerente",
        "TELEFONE/WHATSAPP COM DDD (Requerente)",
      );
      required("emailRequerente", "E-MAIL (Requerente)");

      validateCpf("cpfRequerente", "CPF (Requerente)");
      validateCepField("enderecoRequerenteCep", "CEP (Requerente)");
      validatePhoneField(
        "telefoneWhatsappRequerente",
        "TELEFONE/WHATSAPP COM DDD (Requerente)",
      );
      validateEmail("emailRequerente", "E-MAIL (Requerente)");
    }

    // CAMPO III
    required("inscricaoImobiliaria", "INSCRIÇÃO IMOBILIÁRIA");
    required("enderecoImovel", "ENDEREÇO (Imóvel)");
    required("numeroImovel", "Nº (Imóvel)");
    required("bairroImovel", "BAIRRO (Imóvel)");
    required("cepImovel", "CEP (Imóvel)");

    validateNumericOnlyField("inscricaoImobiliaria", "INSCRIÇÃO IMOBILIÁRIA", {
      minLength: 1,
    });
    validateCepField("cepImovel", "CEP (Imóvel)");

    // CAMPO IV
    required("anoTaxaLixo", "ANO DA TAXA LIXO");
    required("valorTaxaCobrada", "VALOR DA TAXA COBRADA");
    required("valorCorreto", "VALOR QUE CONSIDERA CORRETO");

    validateYearField("anoTaxaLixo", "ANO DA TAXA LIXO");
    validateCurrencyField("valorTaxaCobrada", "VALOR DA TAXA COBRADA");
    validateCurrencyField("valorCorreto", "VALOR QUE CONSIDERA CORRETO");

    if (form.possuiProcessos === "sim") {
      if (!form.numerosProcessos.trim()) {
        addFieldError(
          "numerosProcessos",
          'O campo "Nºs Processos" é obrigatório.',
        );
      } else if (!hasValidProcessFormat(form.numerosProcessos)) {
        addFieldError(
          "numerosProcessos",
          '"Nºs Processos" deve conter apenas números, espaços, ponto, barra ou hífen.',
        );
      }
    }

    if (form.motivoErro.length === 0) {
      errors.push(
        'Selecione pelo menos 1 opção para "O VALOR ESTÁ ERRADO POR MOTIVO(S) DE".',
      );
      groups.push("motivoErroGroup");
    }

    required("motivacaoPedido", "DESCRIÇÃO DA MOTIVAÇÃO");

    const uniqueFields = [...new Set(fields)];
    const uniqueGroups = [...new Set(groups)];

    setInvalidFields(uniqueFields);
    setInvalidGroups(uniqueGroups);
    setValidationErrors(errors);

    if (errors.length > 0) {
      requestAnimationFrame(() =>
        scrollToFirstError(uniqueFields, uniqueGroups),
      );
      return false;
    }

    return true;
  }

  async function generatePdf() {
    if (!validateForm()) return;
    if (isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const PW = 210, PH = 297, ML = 15, MR = 15, MT = 14, MB = 18;
      const CW = PW - ML - MR;
      let y = MT;

      const BLUE: [number, number, number]  = [30, 58, 95];
      const GREEN: [number, number, number] = [112, 182, 67];
      const DARK: [number, number, number]  = [36, 52, 76];
      const GRAY: [number, number, number]  = [107, 114, 128];
      const BORD: [number, number, number]  = [215, 221, 230];
      const WHITE: [number, number, number] = [255, 255, 255];

      const tc = (c: [number, number, number]) => pdf.setTextColor(c[0], c[1], c[2]);
      const fc = (c: [number, number, number]) => pdf.setFillColor(c[0], c[1], c[2]);
      const dc = (c: [number, number, number]) => pdf.setDrawColor(c[0], c[1], c[2]);

      function hline(ly: number, c = BORD, lw = 0.25) {
        dc(c);
        pdf.setLineWidth(lw);
        pdf.line(ML, ly, PW - MR, ly);
      }

      function drawPageHeader() {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12.5);
        tc(BLUE);
        pdf.text("PREFEITURA MUNICIPAL DE PORTO VELHO", PW / 2, y + 4.5, { align: "center" });
        y += 7;
        pdf.setFontSize(9.5);
        pdf.text("SECRETARIA MUNICIPAL DE ECONOMIA", PW / 2, y + 3, { align: "center" });
        y += 7;
        fc(GREEN);
        pdf.rect(ML, y, CW, 1, "F");
        y += 5;
      }

      function checkY(need: number) {
        if (y + need > PH - MB) {
          pdf.addPage();
          y = MT;
          drawPageHeader();
        }
      }

      function sectionTitle(title: string) {
        checkY(12);
        fc(BLUE);
        pdf.rect(ML, y, CW, 7, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        tc(WHITE);
        pdf.text(title, ML + 3, y + 4.8);
        y += 12;
      }

      function fieldLine(label: string, value: string) {
        checkY(6);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        tc(DARK);
        const lbl = `${label}: `;
        const lw = pdf.getTextWidth(lbl);
        pdf.text(lbl, ML, y);
        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(value || "–", CW - lw) as string[];
        pdf.text(lines[0] ?? "", ML + lw, y);
        y += 5;
        for (let i = 1; i < lines.length; i++) {
          checkY(5);
          pdf.text(lines[i], ML + lw, y);
          y += 5;
        }
      }

      function fields2(l1: string, v1: string, l2: string, v2: string) {
        checkY(6);
        const half = CW / 2 - 2;
        const x2 = ML + CW / 2 + 2;
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        tc(DARK);
        const t1 = `${l1}: `;
        const w1 = pdf.getTextWidth(t1);
        pdf.text(t1, ML, y);
        pdf.setFont("helvetica", "normal");
        const v1Lines = pdf.splitTextToSize(v1 || "–", half - w1) as string[];
        pdf.text(v1Lines[0] ?? "", ML + w1, y);
        pdf.setFont("helvetica", "bold");
        const t2 = `${l2}: `;
        const w2 = pdf.getTextWidth(t2);
        pdf.text(t2, x2, y);
        pdf.setFont("helvetica", "normal");
        const v2Lines = pdf.splitTextToSize(v2 || "–", half - w2) as string[];
        pdf.text(v2Lines[0] ?? "", x2 + w2, y);
        y += 5;
      }

      function para(text: string, fz = 9) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fz);
        tc(DARK);
        const lines = pdf.splitTextToSize(text, CW) as string[];
        for (const line of lines) {
          checkY(5);
          pdf.text(line, ML, y);
          y += 5;
        }
        y += 2;
      }

      // ── PÁGINA 1 ─────────────────────────────────────────────────────────────
      drawPageHeader();

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      tc(GREEN);
      pdf.text("REQUERIMENTO DE IMPUGNAÇÃO DE LANÇAMENTO", PW / 2, y + 4, { align: "center" });
      y += 7;
      pdf.setFontSize(9.5);
      tc(BLUE);
      pdf.text("TAXA DE LIXO – TRSD", PW / 2, y + 3, { align: "center" });
      y += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      tc(GRAY);
      pdf.text(
        "Prefeitura Municipal de Porto Velho – Secretaria Municipal de Economia",
        PW / 2, y + 3, { align: "center" },
      );
      y += 8;

      // I
      sectionTitle("I – DADOS DO SUJEITO PASSIVO");
      fieldLine("Nome / Razão Social", form.nomeSujeitoPassivo);
      fields2("CPF / CNPJ", form.cpfCnpjSujeito, "Documento de Identidade", form.documentoIdentidadeSujeito);
      fields2("Endereço", form.enderecoSujeito, "Nº", form.numeroSujeito);
      fields2("Complemento", form.complementoSujeito || "–", "Bairro", form.bairroSujeito);
      fields2("CEP", form.cepSujeito, "Cidade/UF", form.cidadeUfSujeito);
      fields2("WhatsApp", form.whatsappSujeito, "Telefone", form.telefoneSujeito || "–");
      fieldLine("E-mail", form.emailSujeito);

      // II
      sectionTitle("II – DADOS DO REQUERENTE");
      fieldLine("Tipo de Requerente", tipoRequerenteLabels[form.tipoRequerente]);
      if (form.tipoRequerente === "proprioContribuinte") {
        checkY(6);
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(8.5);
        tc(GRAY);
        pdf.text(
          "O requerente é o próprio contribuinte, dispensando a repetição dos dados pessoais nesta seção.",
          ML, y,
        );
        y += 6;
      } else {
        fieldLine("Nome Completo", form.nomeRequerenteCompleto);
        fieldLine("CPF", form.cpfRequerente);
        fields2("Endereço", form.enderecoRequerenteRua, "Nº", form.enderecoRequerenteNumero);
        fields2("Complemento", form.enderecoRequerenteComplemento || "–", "Bairro", form.enderecoRequerenteBairro);
        fields2("CEP", form.enderecoRequerenteCep, "Cidade/UF", form.enderecoRequerenteCidadeUf);
        fieldLine("Telefone/WhatsApp", form.telefoneWhatsappRequerente);
        fieldLine("E-mail", form.emailRequerente);
      }

      // III
      sectionTitle("III – DADOS DO IMÓVEL");
      fieldLine("Inscrição Imobiliária", form.inscricaoImobiliaria);
      fields2("Endereço", form.enderecoImovel, "Nº", form.numeroImovel);
      fields2("Complemento", form.complementoImovel || "–", "Bairro", form.bairroImovel);
      fields2("CEP", form.cepImovel, "Cidade/UF", form.cidadeUfImovel);
      fieldLine("Distrito", form.distritoImovel || "–");

      // IV
      sectionTitle("IV – RESUMO DA IMPUGNAÇÃO");
      checkY(22);
      const tX = [ML, ML + 30, ML + 72, ML + 134];
      const tRH = 7;
      fc(BLUE);
      pdf.rect(ML, y, CW, tRH, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      tc(WHITE);
      const tHdrs = ["Ano", "Valor Cobrado", "Valor Considerado Correto", "Diferença"];
      for (let i = 0; i < tHdrs.length; i++) {
        pdf.text(tHdrs[i], tX[i] + 2, y + 4.8);
      }
      y += tRH;
      dc(BORD);
      pdf.setLineWidth(0.2);
      pdf.rect(ML, y, CW, tRH, "S");
      pdf.setFont("helvetica", "normal");
      tc(DARK);
      const tVals = [
        form.anoTaxaLixo,
        form.valorTaxaCobrada,
        form.valorCorreto,
        formatCurrencyBR(differenceValue),
      ];
      for (let i = 0; i < tVals.length; i++) {
        pdf.text(tVals[i] || "–", tX[i] + 2, y + 4.8);
      }
      y += tRH + 5;

      fields2(
        "Possui processos anteriores",
        possuiProcessosLabels[form.possuiProcessos] +
          (form.possuiProcessos === "sim" && form.numerosProcessos
            ? ` (${form.numerosProcessos})`
            : ""),
        "Utilização do imóvel",
        utilizacaoImovelLabels[form.utilizacaoImovel],
      );
      fieldLine(
        "Motivos alegados",
        form.motivoErro.map((m) => motivoErroLabels[m]).join(", ") || "–",
      );

      // ── FUNDAMENTAÇÃO ────────────────────────────────────────────────────────
      for (let idx = 0; idx < motivacaoChunks.length; idx++) {
        pdf.addPage();
        y = MT;
        drawPageHeader();
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        tc(GREEN);
        pdf.text("FUNDAMENTAÇÃO DO PEDIDO", PW / 2, y + 4, { align: "center" });
        y += 7;
        pdf.setFontSize(9.5);
        tc(BLUE);
        pdf.text(
          idx === 0 ? "Descrição fática e de direito" : "Continuação",
          PW / 2, y + 3, { align: "center" },
        );
        y += 6;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        tc(GRAY);
        pdf.text(
          "Requerimento de Impugnação de Lançamento – TRSD",
          PW / 2, y + 3, { align: "center" },
        );
        y += 8;

        if (idx === 0) {
          sectionTitle("V – INFORMAÇÕES SOBRE A IMPUGNAÇÃO");
          para(
            "O requerente apresenta impugnação administrativa do lançamento da Taxa de " +
            "Resíduos Sólidos Domiciliares (TRSD), referente ao imóvel acima identificado, " +
            "sustentando que o valor lançado não corresponde à realidade fática e cadastral " +
            "do bem, pelas razões a seguir expostas.",
          );
        }

        sectionTitle(idx === 0 ? "VI – MOTIVAÇÃO DO PEDIDO" : "VI – MOTIVAÇÃO DO PEDIDO (CONTINUAÇÃO)");
        para(motivacaoChunks[idx]);
      }

      // ── DECLARAÇÃO ───────────────────────────────────────────────────────────
      pdf.addPage();
      y = MT;
      drawPageHeader();
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      tc(GREEN);
      pdf.text("DECLARAÇÃO E ASSINATURA", PW / 2, y + 4, { align: "center" });
      y += 7;
      pdf.setFontSize(9.5);
      tc(BLUE);
      pdf.text("Requerimento de Impugnação de Lançamento – TRSD", PW / 2, y + 3, { align: "center" });
      y += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      tc(GRAY);
      pdf.text(
        "Prefeitura Municipal de Porto Velho – Secretaria Municipal de Economia",
        PW / 2, y + 3, { align: "center" },
      );
      y += 8;

      sectionTitle("VII – DECLARAÇÃO");
      para(
        "Declaro, sob as penas da lei, que todas as informações constantes neste requerimento " +
        "são verdadeiras, completas e compatíveis com a documentação apresentada.",
      );
      para(
        "Declaro, ainda, estar ciente das disposições legais aplicáveis à matéria, inclusive " +
        "quanto à responsabilidade por eventual omissão ou falsidade de informações, bem como " +
        "autorizo o recebimento de notificações e intimações por meio do Domicílio Tributário " +
        "Eletrônico (DTEL), WhatsApp e e-mail.",
      );
      para(
        "Reconheço que a presente impugnação será analisada pela Administração Tributária " +
        "Municipal com base nos fatos, fundamentos e documentos apresentados, podendo ser " +
        "deferida ou indeferida conforme a legislação vigente.",
      );

      hline(y);
      y += 7;

      checkY(8);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      tc(DARK);
      pdf.text(`Porto Velho/RO, ${formatDateExtenso(new Date())}`, PW / 2, y, { align: "center" });
      y += 22;

      checkY(20);
      hline(y, BLUE, 0.5);
      y += 5;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      tc(DARK);
      pdf.text(signatureName || "______________________________", PW / 2, y, { align: "center" });
      y += 5;
      pdf.setFont("helvetica", "normal");
      pdf.text(`CPF/CNPJ: ${signatureCpf || "–"}`, PW / 2, y, { align: "center" });
      y += 10;

      hline(y);
      y += 6;
      checkY(10);
      pdf.setFontSize(8);
      tc(DARK);
      pdf.setFont("helvetica", "bold");
      const blLabel = "BASE LEGAL: ";
      const blLw = pdf.getTextWidth(blLabel);
      pdf.text(blLabel, ML, y);
      pdf.setFont("helvetica", "normal");
      const blText =
        "Legislação tributária municipal aplicável à Taxa de Resíduos Sólidos Domiciliares " +
        "(TRSD), incluindo a LC 878/2021 e normas correlatas mencionadas no requerimento.";
      const blLines = pdf.splitTextToSize(blText, CW - blLw) as string[];
      pdf.text(blLines[0] ?? "", ML + blLw, y);
      for (let i = 1; i < blLines.length; i++) {
        y += 4.5;
        checkY(5);
        pdf.text(blLines[i], ML, y);
      }

      // Rodapé em todas as páginas
      const total = pdf.getNumberOfPages();
      for (let p = 1; p <= total; p++) {
        pdf.setPage(p);
        hline(PH - 10, BORD, 0.2);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        tc(GRAY);
        pdf.text("Anexo – Requerimento de Impugnação TRSD", ML, PH - 6);
        pdf.text(
          `Gerado eletronicamente em ${getPdfGeneratedDateLabel()} — Pág. ${p}/${total}`,
          PW - MR, PH - 6, { align: "right" },
        );
      }

      const fileDate = new Date().toISOString().slice(0, 10);
      pdf.save(`requerimento-impugnacao-trsd-${fileDate}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <>
      {isGeneratingPdf && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-[5px] border-white/30 border-t-[#70B643]" />
            <h2 className="text-xl font-bold">Gerando PDF...</h2>
            <p className="mt-2 text-sm text-white/80">
              Por favor, aguarde alguns instantes
            </p>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg md:p-10">
          {validationErrors.length > 0 && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
              <p className="mb-2 font-bold text-red-700">
                Corrija os seguintes erros:
              </p>
              <ul className="ml-5 list-disc text-sm text-red-600">
                {validationErrors.map((error, index) => (
                  <li key={`${error}-${index}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <h4 className="mb-8 text-center text-xl font-bold text-[#70B643] md:text-2xl">
            REQUERIMENTO - IMPUGNAÇÃO DE LANÇAMENTO TAXA DE LIXO - TRSD
          </h4>

          <p className="mb-6 text-sm leading-6 text-gray-700 md:text-base">
            Ilmo. (a) Sr. (a) Secretário (a) Municipal de Economia, apresento o
            presente requerimento de impugnação referente à Taxa de Resíduos
            Sólidos Domiciliares (TRSD), conforme os dados abaixo.
          </p>

          <SectionCard title="CAMPO I - DADOS DO SUJEITO PASSIVO">
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <InputField
                id="nomeSujeitoPassivo"
                label="NOME / RAZÃO SOCIAL (Por extenso sem abreviações):"
                value={form.nomeSujeitoPassivo}
                onChange={handleChange}
                placeholder="Digite o nome completo ou razão social"
                invalid={isInvalidField("nomeSujeitoPassivo")}
                className="md:col-span-2"
              />

              <InputField
                id="cpfCnpjSujeito"
                label="CPF / CNPJ:"
                value={form.cpfCnpjSujeito}
                onChange={handleCpfCnpjChange}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                invalid={isInvalidField("cpfCnpjSujeito")}
                maxLength={18}
              />

              <InputField
                id="documentoIdentidadeSujeito"
                label="DOCUMENTO DE IDENTIDADE:"
                value={form.documentoIdentidadeSujeito}
                onChange={handleChange}
                placeholder="Digite o número do documento"
                invalid={isInvalidField("documentoIdentidadeSujeito")}
                maxLength={10}
              />

              <InputField
                id="enderecoSujeito"
                label="ENDEREÇO:"
                value={form.enderecoSujeito}
                onChange={handleChange}
                placeholder="Rua, Avenida..."
                invalid={isInvalidField("enderecoSujeito")}
              />

              <InputField
                id="numeroSujeito"
                label="Nº:"
                value={form.numeroSujeito}
                onChange={handleChange}
                placeholder="Número"
                invalid={isInvalidField("numeroSujeito")}
              />

              <InputField
                id="complementoSujeito"
                label="COMPLEMENTO:"
                value={form.complementoSujeito}
                onChange={handleChange}
                placeholder="Apto, Bloco, Casa..."
              />

              <InputField
                id="bairroSujeito"
                label="BAIRRO:"
                value={form.bairroSujeito}
                onChange={handleChange}
                placeholder="Digite o bairro"
                invalid={isInvalidField("bairroSujeito")}
              />

              <InputField
                id="cepSujeito"
                label="CEP:"
                value={form.cepSujeito}
                onChange={handleChange}
                placeholder="00000-000"
                invalid={isInvalidField("cepSujeito")}
              />

              <InputField
                id="cidadeUfSujeito"
                label="CIDADE / UF:"
                value={form.cidadeUfSujeito}
                onChange={handleChange}
                placeholder="Cidade/UF"
                invalid={isInvalidField("cidadeUfSujeito")}
              />

              <InputField
                id="whatsappSujeito"
                label="WHATSAPP COM DDD:"
                value={form.whatsappSujeito}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                invalid={isInvalidField("whatsappSujeito")}
                maxLength={15}
              />

              <InputField
                id="emailSujeito"
                label="E-MAIL:"
                value={form.emailSujeito}
                onChange={handleChange}
                type="email"
                placeholder="email@exemplo.com"
                invalid={isInvalidField("emailSujeito")}
              />

              <InputField
                id="telefoneSujeito"
                label="TELEFONE COM DDD:"
                value={form.telefoneSujeito}
                onChange={handlePhoneChange}
                placeholder="(00) 0000-0000"
                maxLength={15}
              />
            </div>
          </SectionCard>

          <SectionCard title="CAMPO II - DADOS DO REQUERENTE (Representante Legal, Procurador, Compromissário/Posseiro)">
            <div className="p-4">
              <div
                id="tipoRequerenteGroup"
                className={`rounded-md ${
                  isInvalidGroup("tipoRequerenteGroup")
                    ? "border border-red-300 bg-red-50 p-3"
                    : ""
                }`}
              >
                <div className="space-y-3 text-sm text-gray-700">
                  <label className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={form.tipoRequerente === "proprioContribuinte"}
                      onChange={() =>
                        handleRadioChange(
                          "tipoRequerente",
                          "proprioContribuinte",
                        )
                      }
                      className="mt-1"
                    />
                    <span>
                      O PRÓPRIO CONTRIBUINTE (Não é necessário preencher os
                      dados repetidos)
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={form.tipoRequerente === "procurador"}
                      onChange={() =>
                        handleRadioChange("tipoRequerente", "procurador")
                      }
                      className="mt-1"
                    />
                    <span>PROCURADOR OU REPRESENTANTE LEGAL</span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={form.tipoRequerente === "compromissario"}
                      onChange={() =>
                        handleRadioChange("tipoRequerente", "compromissario")
                      }
                      className="mt-1"
                    />
                    <span>
                      COMPROMISSÁRIO/POSSEIRO (Comprou o imóvel mas não averbou)
                    </span>
                  </label>
                </div>
              </div>

              {form.tipoRequerente !== "proprioContribuinte" && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    id="nomeRequerenteCompleto"
                    label="NOME COMPLETO (Por extenso sem abreviações):"
                    value={form.nomeRequerenteCompleto}
                    onChange={handleChange}
                    placeholder="Digite o nome completo do requerente"
                    invalid={isInvalidField("nomeRequerenteCompleto")}
                    className="md:col-span-2"
                  />

                  <InputField
                    id="cpfRequerente"
                    label="CPF:"
                    value={form.cpfRequerente}
                    onChange={handleChange}
                    placeholder="Digite o CPF do requerente"
                    invalid={isInvalidField("cpfRequerente")}
                  />

                  <div />

                  <InputField
                    id="enderecoRequerenteRua"
                    label="ENDEREÇO (RUA, AVENIDA):"
                    value={form.enderecoRequerenteRua}
                    onChange={handleChange}
                    placeholder="Rua, Avenida..."
                    invalid={isInvalidField("enderecoRequerenteRua")}
                  />

                  <InputField
                    id="enderecoRequerenteNumero"
                    label="Nº:"
                    value={form.enderecoRequerenteNumero}
                    onChange={handleChange}
                    placeholder="Número"
                    invalid={isInvalidField("enderecoRequerenteNumero")}
                  />

                  <InputField
                    id="enderecoRequerenteComplemento"
                    label="COMPLEMENTO:"
                    value={form.enderecoRequerenteComplemento}
                    onChange={handleChange}
                    placeholder="Apto, Bloco, Casa..."
                  />

                  <InputField
                    id="enderecoRequerenteBairro"
                    label="BAIRRO:"
                    value={form.enderecoRequerenteBairro}
                    onChange={handleChange}
                    placeholder="Digite o bairro"
                    invalid={isInvalidField("enderecoRequerenteBairro")}
                  />

                  <InputField
                    id="enderecoRequerenteCep"
                    label="CEP:"
                    value={form.enderecoRequerenteCep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    invalid={isInvalidField("enderecoRequerenteCep")}
                  />

                  <InputField
                    id="enderecoRequerenteCidadeUf"
                    label="CIDADE / UF:"
                    value={form.enderecoRequerenteCidadeUf}
                    onChange={handleChange}
                    placeholder="Cidade/UF"
                    invalid={isInvalidField("enderecoRequerenteCidadeUf")}
                  />

                  <InputField
                    id="telefoneWhatsappRequerente"
                    label="TELEFONE/WHATSAPP COM DDD:"
                    value={form.telefoneWhatsappRequerente}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                    invalid={isInvalidField("telefoneWhatsappRequerente")}
                    maxLength={15}
                  />

                  <InputField
                    id="emailRequerente"
                    label="E-MAIL:"
                    value={form.emailRequerente}
                    onChange={handleChange}
                    type="email"
                    placeholder="email@exemplo.com"
                    invalid={isInvalidField("emailRequerente")}
                  />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="CAMPO III - DADOS DO IMÓVEL OBJETO DO PEDIDO">
            <div className="grid grid-cols-1 gap-4 p-4">
              <InputField
                id="inscricaoImobiliaria"
                label="INSCRIÇÃO IMOBILIÁRIA. ATENÇÃO: SOMENTE UMA INSCRIÇÃO POR REQUERIMENTO"
                value={form.inscricaoImobiliaria}
                onChange={handleChange}
                placeholder="Somente números"
                invalid={isInvalidField("inscricaoImobiliaria")}
              />

              <InputField
                id="enderecoImovel"
                label="ENDEREÇO:"
                value={form.enderecoImovel}
                onChange={handleChange}
                placeholder="Rua, Avenida do imóvel"
                invalid={isInvalidField("enderecoImovel")}
              />

              <InputField
                id="numeroImovel"
                label="Nº:"
                value={form.numeroImovel}
                onChange={handleChange}
                placeholder="Número"
                invalid={isInvalidField("numeroImovel")}
                inputClassName="max-w-[160px]"
              />

              <InputField
                id="complementoImovel"
                label="COMPLEMENTO:"
                value={form.complementoImovel}
                onChange={handleChange}
                placeholder="Apto, Bloco, Casa, Condomínio..."
              />

              <InputField
                id="bairroImovel"
                label="BAIRRO:"
                value={form.bairroImovel}
                onChange={handleChange}
                placeholder="Bairro do imóvel"
                invalid={isInvalidField("bairroImovel")}
              />

              <InputField
                id="cepImovel"
                label="CEP:"
                value={form.cepImovel}
                onChange={handleChange}
                placeholder="00000-000"
                invalid={isInvalidField("cepImovel")}
                inputClassName="max-w-[220px]"
              />

              <InputField
                id="cidadeUfImovel"
                label="CIDADE / UF:"
                value={form.cidadeUfImovel}
                onChange={handleChange}
                readOnly
              />

              <InputField
                id="distritoImovel"
                label="DISTRITO (NÃO PREENCHER SE PVH):"
                value={form.distritoImovel}
                onChange={handleChange}
                placeholder="Nome do distrito (se aplicável)"
              />
            </div>
          </SectionCard>

          <SectionCard title="CAMPO IV - INFORMAÇÕES SOBRE A IMPUGNAÇÃO">
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  id="anoTaxaLixo"
                  label="ANO DA TAXA LIXO:"
                  value={form.anoTaxaLixo}
                  onChange={handleChange}
                  placeholder="Ex: 2024"
                  invalid={isInvalidField("anoTaxaLixo")}
                />

                <InputField
                  id="valorTaxaCobrada"
                  label="VALOR DA TAXA COBRADA R$:"
                  value={form.valorTaxaCobrada}
                  onChange={handleCurrencyChange}
                  placeholder="0,00"
                  invalid={isInvalidField("valorTaxaCobrada")}
                />

                <InputField
                  id="valorCorreto"
                  label="QUAL O VALOR QUE CONSIDERA CORRETO R$:"
                  value={form.valorCorreto}
                  onChange={handleCurrencyChange}
                  placeholder="0,00"
                  invalid={isInvalidField("valorCorreto")}
                />

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    CLIQUE AQUI E GERE O DAM (BOLETO) ONLINE NA OPÇÃO
                    &quot;TAXAS WEB&quot;
                  </label>
                  <a
                    href="https://gpi-trb.portovelho.ro.gov.br/ServerExec/acessoBase/?idPortal=dbde30ec-cf59-4803-9653-00121a704021"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#26476f]"
                  >
                    Gerar DAM
                  </a>
                </div>
              </div>

              <div id="possuiProcessosGroup">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  POSSUI PROCESSOS ANTERIORES, INCLUSIVE DE ATUALIZAÇÃO
                  CADASTRAL DE IMÓVEL:
                </label>

                <div className="flex flex-col gap-3 text-sm text-gray-700 md:flex-row md:flex-wrap md:items-center">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={form.possuiProcessos === "nao"}
                      onChange={() =>
                        handleRadioChange("possuiProcessos", "nao")
                      }
                    />
                    <span>NÃO</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={form.possuiProcessos === "sim"}
                      onChange={() =>
                        handleRadioChange("possuiProcessos", "sim")
                      }
                    />
                    <span>SIM</span>
                  </label>

                  {form.possuiProcessos === "sim" && (
                    <div className="w-full md:w-[320px]">
                      <InputField
                        id="numerosProcessos"
                        label="Nºs.:"
                        value={form.numerosProcessos}
                        onChange={handleChange}
                        placeholder="Digite os números dos processos"
                        invalid={isInvalidField("numerosProcessos")}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div id="utilizacaoImovelGroup">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  QUAL A UTILIZAÇÃO DO IMÓVEL:
                </label>

                <div className="space-y-2 text-sm text-gray-700 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                  {(
                    [
                      "residencial",
                      "naoResidencial",
                      "misto",
                      "naoEdificado",
                      "emRuinas",
                    ] as UtilizacaoImovel[]
                  ).map((item) => (
                    <label key={item} className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={form.utilizacaoImovel === item}
                        onChange={() =>
                          handleRadioChange("utilizacaoImovel", item)
                        }
                        className="mt-1"
                      />
                      <span>{utilizacaoImovelLabels[item]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div
                id="motivoErroGroup"
                className={`rounded-md ${
                  isInvalidGroup("motivoErroGroup")
                    ? "border border-red-300 bg-red-50 p-3"
                    : ""
                }`}
              >
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  O VALOR ESTÁ ERRADO POR MOTIVO(S) DE:
                </label>

                <div className="space-y-2 text-sm text-gray-700">
                  {(
                    ["areaConstruida", "erroCalculo", "outros"] as MotivoErro[]
                  ).map((item) => (
                    <label key={item} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.motivoErro.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                        className="mt-1"
                      />
                      <span>{motivoErroLabels[item]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <TextAreaField
                id="motivacaoPedido"
                label="DESCREVA A MOTIVAÇÃO FÁTICA E DE DIREITO DO PEDIDO E TODA A MATÉRIA QUE ENTENDER ÚTIL, INDICANDO AS PROVAS QUE HOUVER:"
                value={form.motivacaoPedido}
                onChange={handleChange}
                placeholder="Informe de forma clara os fatos, fundamentos jurídicos e as provas que possuir."
                invalid={isInvalidField("motivacaoPedido")}
              />
            </div>
          </SectionCard>

          <div className="mb-4 space-y-1 text-center text-xs text-gray-500">
            <p>Anexo – Requerimento de Impugnação TRSD</p>
            <p>Documento gerado eletronicamente em {currentDate}</p>
          </div>

          <div className="pb-4 text-center">
            <button
              type="button"
              onClick={generatePdf}
              className="rounded-full bg-[#70B643] px-8 py-3 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-[1.02] hover:bg-[#5ea637] focus:outline-none focus:ring-2 focus:ring-[#70B643]/50"
            >
              Gerar e Baixar PDF
            </button>
          </div>
        </div>
      </section>

    </>
  );
}
