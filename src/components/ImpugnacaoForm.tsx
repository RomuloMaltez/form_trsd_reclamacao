"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import html2canvas from "html2canvas";
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
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
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

const pdfHeaderStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "18px",
  borderBottom: "2px solid #333",
  paddingBottom: "12px",
};

const pdfTitleStyle: CSSProperties = {
  fontSize: "17pt",
  marginBottom: "6px",
  color: "#000",
  fontWeight: 700,
};

const pdfSubTitleStyle: CSSProperties = {
  fontSize: "13pt",
  marginBottom: "4px",
  fontWeight: 400,
  color: "#333",
};

const pdfHeaderTextStyle: CSSProperties = {
  fontSize: "9pt",
  color: "#666",
};

const pdfSectionTitleStyle: CSSProperties = {
  background: "#333",
  color: "#fff",
  padding: "0 0 15px 5px",
  margin: "12px 0 8px 0",
  fontSize: "11pt",
  fontWeight: 700,
};

const pdfFieldLineStyle: CSSProperties = {
  marginBottom: "6px",
  lineHeight: 1.6,
};

const pdfParagraphStyle: CSSProperties = {
  marginBottom: "10px",
  textAlign: "justify",
};

const pdfCheckboxLineStyle: CSSProperties = {
  margin: "6px 0",
  padding: "4px",
  border: "1px solid #ddd",
};

const pdfTableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  margin: "12px 0",
};

const pdfCellStyle: CSSProperties = {
  border: "1px solid #333",
  padding: "6px",
  textAlign: "left",
  fontSize: "9.5pt",
};

const pdfThStyle: CSSProperties = {
  ...pdfCellStyle,
  background: "#f0f0f0",
  fontWeight: 700,
};

const pdfSignatureAreaStyle: CSSProperties = {
  marginTop: "35px",
  textAlign: "center",
};

const pdfSignatureLineStyle: CSSProperties = {
  borderTop: "1px solid #000",
  width: "300px",
  margin: "95px auto 8px",
};

const pdfHrStyle: CSSProperties = {
  border: "none",
  borderTop: "1px solid #333",
  margin: "15px 0",
};

const TIMBRADO_HEADER_SRC = "/semec-timbrado-cabecalho.png";
const TIMBRADO_FOOTER_SRC = "/semec-timbrado-rodape.png";

const pdfPaperStyle: CSSProperties = {
  position: "relative",
  width: "210mm",
  minHeight: "340mm",
  height: "340mm",
  background: "#ffffff",
  overflow: "hidden",
};

const HEADER_SPACE = "28mm";
const FOOTER_SPACE = "26mm";

const pdfTimbradoHeaderStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: HEADER_SPACE,
  zIndex: 1,
};

const pdfTimbradoHeaderImgStyle: CSSProperties = {
  width: "100%",
  display: "block",
};

const pdfTimbradoFooterStyle: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: FOOTER_SPACE,
  zIndex: 1,
};

const pdfTimbradoFooterImgStyle: CSSProperties = {
  width: "100%",
  display: "block",
};

const pdfContentLayerStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  boxSizing: "border-box",
  width: "190mm",
  paddingTop: `calc(${HEADER_SPACE} + 2mm)`,
  paddingBottom: `calc(${FOOTER_SPACE} + 6mm)`,
  margin: "0 auto",
  background: "transparent",
  fontFamily: "Arial, sans-serif",
  fontSize: "10.5pt",
  lineHeight: 1.4,
  color: "#000000",
};

function PdfPageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="pdf-page" style={pdfPaperStyle}>
      <div style={pdfTimbradoHeaderStyle}>
        <img
          src={TIMBRADO_HEADER_SRC}
          alt=""
          style={pdfTimbradoHeaderImgStyle}
        />
      </div>

      <div style={pdfTimbradoFooterStyle}>
        <img
          src={TIMBRADO_FOOTER_SRC}
          alt=""
          style={pdfTimbradoFooterImgStyle}
        />
      </div>

      <div style={pdfContentLayerStyle}>{children}</div>
    </div>
  );
}

export default function ImpugnacaoForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const pdfRef = useRef<HTMLDivElement>(null);
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

    if (!pdfRef.current) {
      alert("Erro ao preparar o conteúdo do PDF.");
      return;
    }

    setIsGeneratingPdf(true);

    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(() => resolve(), 300);
        });
      });

      const images = Array.from(
        pdfRef.current.querySelectorAll("img"),
      ) as HTMLImageElement[];

      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }

              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
        ),
      );

      const pages = pdfRef.current.querySelectorAll<HTMLElement>(".pdf-page");

      if (!pages.length) {
        throw new Error("Nenhuma página do PDF foi encontrada.");
      }

      const pdf = new jsPDF("p", "mm", "a4");

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: pages[i].scrollWidth,
          height: pages[i].scrollHeight,
          windowWidth: pages[i].scrollWidth,
          windowHeight: pages[i].scrollHeight,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
      }

      pdf.save("requerimento_impugnacao_taxa_lixo.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert(
        `Erro ao gerar PDF: ${
          error instanceof Error ? error.message : "erro desconhecido"
        }`,
      );
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
            Ilmo. (a) Sr. (a) Secretário (a) Municipal de Fazenda, apresento o
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
                onChange={handleChange}
                placeholder="Digite o CPF ou CNPJ"
                invalid={isInvalidField("cpfCnpjSujeito")}
              />

              <InputField
                id="documentoIdentidadeSujeito"
                label="DOCUMENTO DE IDENTIDADE:"
                value={form.documentoIdentidadeSujeito}
                onChange={handleChange}
                placeholder="Digite o número do documento"
                invalid={isInvalidField("documentoIdentidadeSujeito")}
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
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                invalid={isInvalidField("whatsappSujeito")}
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
                onChange={handleChange}
                placeholder="(00) 0000-0000"
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
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    invalid={isInvalidField("telefoneWhatsappRequerente")}
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
                  onChange={handleChange}
                  placeholder="Ex: 150,00"
                  invalid={isInvalidField("valorTaxaCobrada")}
                />

                <InputField
                  id="valorCorreto"
                  label="QUAL O VALOR QUE CONSIDERA CORRETO:"
                  value={form.valorCorreto}
                  onChange={handleChange}
                  placeholder="Ex: 100,00"
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

      <div
        ref={pdfRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          zIndex: -1,
        }}
      >
        <PdfPageFrame>
          <div style={pdfHeaderStyle}>
            <div style={pdfTitleStyle}>
              REQUERIMENTO DE IMPUGNAÇÃO DE LANÇAMENTO
            </div>
            <div style={pdfSubTitleStyle}>Taxa de Lixo - TRSD</div>
            <p style={pdfHeaderTextStyle}>
              Prefeitura Municipal de Porto Velho - Secretaria Municipal de
              Fazenda
            </p>
          </div>

          <div style={pdfSectionTitleStyle}>I - DADOS DO SUJEITO PASSIVO</div>
          <div style={pdfFieldLineStyle}>
            <strong>Nome / Razão Social:</strong> {form.nomeSujeitoPassivo}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>CPF / CNPJ:</strong> {form.cpfCnpjSujeito} &nbsp;&nbsp;
            <strong>Documento de Identidade:</strong>{" "}
            {form.documentoIdentidadeSujeito}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>Endereço:</strong> {form.enderecoSujeito},{" "}
            {form.numeroSujeito}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>Complemento:</strong> {form.complementoSujeito || "-"}{" "}
            &nbsp;&nbsp;
            <strong>Bairro:</strong> {form.bairroSujeito}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>CEP:</strong> {form.cepSujeito} &nbsp;&nbsp;
            <strong>Cidade/UF:</strong> {form.cidadeUfSujeito}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>WhatsApp:</strong> {form.whatsappSujeito} &nbsp;&nbsp;
            <strong>Telefone:</strong> {form.telefoneSujeito || "-"}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>E-mail:</strong> {form.emailSujeito}
          </div>

          <div style={pdfSectionTitleStyle}>II - DADOS DO REQUERENTE</div>
          <div style={pdfFieldLineStyle}>
            <strong>Tipo de Requerente:</strong>{" "}
            {tipoRequerenteLabels[form.tipoRequerente]}
          </div>

          {form.tipoRequerente === "proprioContribuinte" ? (
            <p style={pdfParagraphStyle}>
              O requerente é o próprio contribuinte, dispensando a repetição dos
              dados pessoais nesta seção.
            </p>
          ) : (
            <>
              <div style={pdfFieldLineStyle}>
                <strong>Nome Completo:</strong> {form.nomeRequerenteCompleto}
              </div>
              <div style={pdfFieldLineStyle}>
                <strong>CPF:</strong> {form.cpfRequerente}
              </div>
              <div style={pdfFieldLineStyle}>
                <strong>Endereço:</strong> {form.enderecoRequerenteRua},{" "}
                {form.enderecoRequerenteNumero}
              </div>
              <div style={pdfFieldLineStyle}>
                <strong>Complemento:</strong>{" "}
                {form.enderecoRequerenteComplemento || "-"} &nbsp;&nbsp;
                <strong>Bairro:</strong> {form.enderecoRequerenteBairro}
              </div>
              <div style={pdfFieldLineStyle}>
                <strong>CEP:</strong> {form.enderecoRequerenteCep} &nbsp;&nbsp;
                <strong>Cidade/UF:</strong> {form.enderecoRequerenteCidadeUf}
              </div>
              <div style={pdfFieldLineStyle}>
                <strong>Telefone/WhatsApp:</strong>{" "}
                {form.telefoneWhatsappRequerente}
              </div>
              <div style={pdfFieldLineStyle}>
                <strong>E-mail:</strong> {form.emailRequerente}
              </div>
            </>
          )}

          <div style={pdfSectionTitleStyle}>III - DADOS DO IMÓVEL</div>
          <div style={pdfFieldLineStyle}>
            <strong>Inscrição Imobiliária:</strong> {form.inscricaoImobiliaria}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>Endereço:</strong> {form.enderecoImovel},{" "}
            {form.numeroImovel}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>Complemento:</strong> {form.complementoImovel || "-"}{" "}
            &nbsp;&nbsp;
            <strong>Bairro:</strong> {form.bairroImovel}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>CEP:</strong> {form.cepImovel} &nbsp;&nbsp;
            <strong>Cidade/UF:</strong> {form.cidadeUfImovel}
          </div>
          <div style={pdfFieldLineStyle}>
            <strong>Distrito:</strong> {form.distritoImovel || "-"}
          </div>

          <div style={pdfSectionTitleStyle}>IV - RESUMO DA IMPUGNAÇÃO</div>
          <table style={pdfTableStyle}>
            <thead>
              <tr>
                <th style={pdfThStyle}>Ano</th>
                <th style={pdfThStyle}>Valor Cobrado</th>
                <th style={pdfThStyle}>Valor Considerado Correto</th>
                <th style={pdfThStyle}>Diferença</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={pdfCellStyle}>{form.anoTaxaLixo}</td>
                <td style={pdfCellStyle}>{form.valorTaxaCobrada}</td>
                <td style={pdfCellStyle}>{form.valorCorreto}</td>
                <td style={pdfCellStyle}>
                  {formatCurrencyBR(differenceValue)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={pdfFieldLineStyle}>
            <strong>Possui processos anteriores:</strong>{" "}
            {possuiProcessosLabels[form.possuiProcessos]}
            {form.possuiProcessos === "sim" && form.numerosProcessos
              ? ` (${form.numerosProcessos})`
              : ""}
          </div>

          <div style={pdfFieldLineStyle}>
            <strong>Utilização do imóvel:</strong>{" "}
            {utilizacaoImovelLabels[form.utilizacaoImovel]}
          </div>

          <div style={pdfCheckboxLineStyle}>
            <strong>Motivos alegados:</strong>{" "}
            {form.motivoErro.map((item) => motivoErroLabels[item]).join(", ")}
          </div>
        </PdfPageFrame>

        {motivacaoChunks.map((chunk, index) => (
          <PdfPageFrame key={`pdf-mot-${index}`}>
            <div style={pdfHeaderStyle}>
              <div style={pdfTitleStyle}>FUNDAMENTAÇÃO DO PEDIDO</div>
              <div style={pdfSubTitleStyle}>
                {index === 0 ? "Descrição fática e de direito" : "Continuação"}
              </div>
              <p style={pdfHeaderTextStyle}>
                Requerimento de Impugnação de Lançamento - TRSD
              </p>
            </div>

            {index === 0 && (
              <>
                <div style={pdfSectionTitleStyle}>
                  V - INFORMAÇÕES SOBRE A IMPUGNAÇÃO
                </div>

                <p style={pdfParagraphStyle}>
                  O requerente apresenta impugnação administrativa do lançamento
                  da Taxa de Resíduos Sólidos Domiciliares (TRSD), referente ao
                  imóvel acima identificado, sustentando que o valor lançado não
                  corresponde à realidade fática e cadastral do bem, pelas
                  razões a seguir expostas.
                </p>
              </>
            )}

            <div style={pdfSectionTitleStyle}>
              {index === 0
                ? "VI - MOTIVAÇÃO DO PEDIDO"
                : "VI - MOTIVAÇÃO DO PEDIDO (CONTINUAÇÃO)"}
            </div>

            <p style={{ ...pdfParagraphStyle, whiteSpace: "pre-line" }}>
              {chunk}
            </p>
          </PdfPageFrame>
        ))}

        <PdfPageFrame>
          <div style={pdfHeaderStyle}>
            <div style={pdfTitleStyle}>DECLARAÇÃO E ASSINATURA</div>
            <div style={pdfSubTitleStyle}>
              Requerimento de Impugnação de Lançamento - TRSD
            </div>
            <p style={pdfHeaderTextStyle}>
              Prefeitura Municipal de Porto Velho - Secretaria Municipal de
              Fazenda
            </p>
          </div>

          <div style={pdfSectionTitleStyle}>VII - DECLARAÇÃO</div>

          <p style={pdfParagraphStyle}>
            Declaro, sob as penas da lei, que todas as informações constantes
            neste requerimento são verdadeiras, completas e compatíveis com a
            documentação apresentada.
          </p>

          <p style={pdfParagraphStyle}>
            Declaro, ainda, estar ciente das disposições legais aplicáveis à
            matéria, inclusive quanto à responsabilidade por eventual omissão ou
            falsidade de informações, bem como autorizo o recebimento de
            notificações e intimações por meio do Domicílio Tributário
            Eletrônico (DTEL), WhatsApp e e-mail.
          </p>

          <p style={pdfParagraphStyle}>
            Reconheço que a presente impugnação será analisada pela
            Administração Tributária Municipal com base nos fatos, fundamentos e
            documentos apresentados, podendo ser deferida ou indeferida conforme
            a legislação vigente.
          </p>

          <div style={pdfHrStyle} />

          <p style={{ ...pdfParagraphStyle, textAlign: "center" }}>
            Porto Velho/RO, {formatDateExtenso(new Date())}
          </p>

          <div style={pdfSignatureAreaStyle}>
            <div style={pdfSignatureLineStyle} />
            <strong>{signatureName}</strong>
            <br />
            CPF/CNPJ: {signatureCpf}
          </div>

          <div style={pdfHrStyle} />

          <p style={{ fontSize: "9pt" }}>
            <strong>BASE LEGAL:</strong> legislação tributária municipal
            aplicável à Taxa de Resíduos Sólidos Domiciliares (TRSD), incluindo
            a LC 878/2021 e normas correlatas mencionadas no requerimento.
          </p>
        </PdfPageFrame>
      </div>
    </>
  );
}
